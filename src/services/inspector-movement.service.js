import { InspectorMovement, Secteur, User, Year, Commune, Daira, Willaya } from "../models/relations.js";
import sequelize from "../config/database.js";

/**
 * دالة تعيين مفتش لمقاطعة (حركة تنقلية)
 * @param {Object} data - بيانات الحركة (user_id, idsecteur, year_id, note)
 * @param {Number} chefWillayaId - معرف ولاية رئيس المصلحة الحالي (من التوكن)
 */
export const assignInspectorToSecteur = async (data, chefWillayaId) => {
  const { user_id, idsecteur, year_id, note } = data;

  // 1. التحقق من أن المفتش يتبع لولاية رئيس المصلحة
  const inspector = await User.findByPk(user_id);
  if (!inspector) {
    throw new Error("المفتش غير موجود في قاعدة البيانات");
  }
  
  if (inspector.willaya_id !== chefWillayaId) {
    throw new Error("لا يمكنك إدارة مفتش تابع لولاية أخرى");
  }

  // 2. التحقق من أن المقاطعة تتبع لولاية رئيس المصلحة
  // نستخدم Include للوصول إلى معرف الولاية من خلال التسلسل الجغرافي
  const secteur = await Secteur.findByPk(idsecteur, {
    include: {
      model: Commune,
      include: {
        model: Daira,
        include: { model: Willaya }
      }
    }
  });

  if (!secteur) {
    throw new Error("المقاطعة المستهدفة غير موجودة");
  }

  // الوصول لـ id الولاية من خلال العلاقات
  const secteurWillayaId = secteur.Commune?.Daira?.idwillaya; 

  if (secteurWillayaId !== chefWillayaId) {
    throw new Error("هذه المقاطعة لا تتبع لنطاق ولايتك الجغرافي");
  }

  // 3. تنفيذ العملية عبر Transaction لضمان سلامة البيانات
  const transaction = await sequelize.transaction();

  try {
    // أ- إغلاق أي حركة نشطة سابقة لهذا المفتش
    await InspectorMovement.update(
      { is_active: false },
      { 
        where: { user_id, is_active: true },
        transaction 
      }
    );

    // ب- إغلاق أي حركة نشطة سابقة في هذه المقاطعة (لأن المقاطعة لها مفتش واحد حالي)
    await InspectorMovement.update(
      { is_active: false },
      { 
        where: { idsecteur, is_active: true },
        transaction 
      }
    );

    // ج- إنشاء سجل الحركة الجديد
    const newMovement = await InspectorMovement.create({
      user_id,
      idsecteur,
      year_id,
      note,
      is_active: true
    }, { transaction });

    // د- تحديث حقل المفتش الحالي في جدول المقاطعات (للسرعة في الاستعلامات العادية)
    await Secteur.update(
      { user_id: user_id },
      { where: { id: idsecteur }, transaction }
    );

    await transaction.commit();
    return newMovement;

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * جلب التاريخ المهني (الحركات) لمفتش معين
 */
export const getInspectorHistory = async (userId) => {
  return await InspectorMovement.findAll({
    where: { user_id: userId },
    include: [
      { model: Secteur, as: 'secteur' },
      { model: Year, as: 'year' }
    ],
    order: [['createdAt', 'DESC']]
  });
};