import { Secteur, User, Commune, Daira, InspectorMovement, Year } from "../models/relations.js";
import sequelize from "../config/database.js";

class SecteursService {

  // 1. جلب الكل مع التحويل لـ inspector
  static async getAllSecteurs(userWillayaId) {
    try {
      const secteurs = await Secteur.findAll({
        include: [
          {
            model: User,
            as: 'current_inspectors',
            attributes: ['id', 'username', 'email', 'phone'],
            through: { where: { is_active: true }, attributes: [] },
            required: false
          },
          {
            model: Commune,
            required: true,
            attributes: ['id', 'communename'],
            include: [{
              model: Daira,
              attributes: ['id', 'idwillaya', 'dairaname'],
              where: { idwillaya: userWillayaId },
              required: true,
            }],
          }
        ]
      });

      return secteurs.map(secteur => {
        const data = secteur.toJSON();
        data.inspector = data.current_inspectors?.[0] || null;
        delete data.current_inspectors;
        return data;
      });
    } catch (error) {
      console.error("Sequelize Error (getAllSecteurs):", error.message);
      throw error;
    }
  }

  // 2. إنشاء مقاطعة مع ضمان تسجيل الحركة
  static async createSecteur(data) {
    // 1. فحص أولي للبيانات قبل فتح الترانزاكشن
    const { secteurname, idcommune, user_id } = data;

    const transaction = await sequelize.transaction();
    try {
      // 2. جلب السنة النشطة (يجب التأكد من وجودها)
      const currentYear = await Year.findOne({
        where: { status: true },
        transaction
      });

      if (!currentYear && user_id) {
        throw new Error("لا توجد سنة دراسية نشطة. يرجى تفعيل سنة دراسية أولاً.");
      }

      // 3. إنشاء المقاطعة
      const newSecteur = await Secteur.create({
        secteurname,
        idcommune,
        user_id: user_id || null
      }, { transaction });

      // 4. تسجيل الحركة في الجدول الوسيط (إذا وجد مفتش)
      if (user_id) {
        await InspectorMovement.create({
          user_id: Number(user_id),
          idsecteur: newSecteur.id,
          year_id: currentYear.id,
          is_active: true,
          note: "تعيين آلي عند إنشاء المقاطعة"
        }, { transaction });
      }

      await transaction.commit();

      // جلب المقاطعة كاملة مع العلاقات بعد النجاح لإعادتها للفرونت إند
      return await Secteur.findByPk(newSecteur.id);

    } catch (error) {
      await transaction.rollback();
      console.error("❌ Error in createSecteur Service:", error.message);
      throw error;
    }
  }

  // 3. تحديث مقاطعة
  static async updateSecteur(id, data) {
    const transaction = await sequelize.transaction();
    try {
      const secteur = await Secteur.findByPk(id, { transaction });
      if (!secteur) return null;

      const oldUserId = secteur.user_id;
      const newUserId = data.user_id;

      await secteur.update(data, { transaction });

      if (newUserId && newUserId !== oldUserId) {
        // إغلاق الحركات القديمة
        await InspectorMovement.update(
          { is_active: false },
          { where: { idsecteur: id, is_active: true }, transaction }
        );

        const currentYear = await Year.findOne({
          where: { status: true },
          transaction
        });

        await InspectorMovement.create({
          user_id: newUserId,
          idsecteur: id,
          year_id: currentYear ? currentYear.id : 1,
          is_active: true,
          note: "تحديث المفتش"
        }, { transaction });
      }

      await transaction.commit();
      return secteur;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // 4. دالة نقل المفتش (Move Inspector) - أضفناها هنا لتكتمل الخدمة
  static async moveInspector(userId, targetSecteurId, note = "نقل تنقلي") {
    const transaction = await sequelize.transaction();
    try {
      const currentYear = await Year.findOne({
        where: { status: true },
        transaction
      });

      // ملاحظة: الـ Hook في الموديل سيغلق الحركة القديمة تلقائياً عند إنشاء هذه الحركة
      await InspectorMovement.create({
        user_id: userId,
        idsecteur: targetSecteurId,
        year_id: currentYear ? currentYear.id : 1,
        is_active: true,
        note: note
      }, { transaction });

      await Secteur.update(
        { user_id: userId },
        { where: { id: targetSecteurId }, transaction }
      );

      await transaction.commit();
      return { success: true };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async deleteSecteur(id) {
    const secteur = await Secteur.findByPk(id);
    if (!secteur) return null;
    await secteur.destroy();
    return true;
  }

  static async getSecteursByCommune(communeId) {
    const secteurs = await Secteur.findAll({
      where: { idcommune: communeId },
      include: [{
        model: User,
        as: "current_inspectors",
        attributes: ["id", "username"],
        through: { where: { is_active: true }, attributes: [] }
      }]
    });

    return secteurs.map(s => {
      const d = s.toJSON();
      d.inspector = d.current_inspectors?.[0] || null;
      delete d.current_inspectors;
      return d;
    });
  }

  // 5. جلب سجل تحركات المفتشين لمقاطعة معينة
static async getSecteurHistory(secteurId) {
  try {
    const history = await InspectorMovement.findAll({
      where: { idsecteur: secteurId },
      include: [
        {
          model: User,
          as: 'inspector', // 👈 تم التغيير ليطابق relations.js
          attributes: ['id', 'username', 'email'],
        },
        {
          model: Year,
          as: 'year', // 👈 أضفنا الـ as الخاص بالسنة أيضاً كما هو في العلاقات
          attributes: ['yearname']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return history;
  } catch (error) {
    console.error("❌ Error in getSecteurHistory Service:", error.message);
    throw error;
  }
}
}

export default SecteursService;