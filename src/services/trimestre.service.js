import Trimestre from "../models/trimestre.model.js";

class TrimestreService {
  /**
   * جلب جميع الثلاثيات مرتبة حسب المعرف
   */
  async getAll() {
    try {
      return await Trimestre.findAll({
        order: [['id', 'ASC']]
      });
    } catch (error) {
      throw new Error("حدث خطأ أثناء جلب الثلاثيات من قاعدة البيانات: " + error.message);
    }
  }

  /**
   * جلب ثلاثي واحد بواسطة المعرف
   */
  async getById(id) {
    try {
      const trimestre = await Trimestre.findByPk(id);
      if (!trimestre) {
        throw new Error("الثلاثي غير موجود");
      }
      return trimestre;
    } catch (error) {
      throw error;
    }
  }

  /**
   * إنشاء ثلاثي جديد
   */
  async create(data) {
    try {
      return await Trimestre.create(data);
    } catch (error) {
      throw new Error("فشل في إنشاء الثلاثي: " + error.message);
    }
  }

  /**
   * تحديث بيانات ثلاثي موجود
   */
  async update(id, data) {
    try {
      const trimestre = await this.getById(id);
      return await trimestre.update(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * حذف ثلاثي نهائياً
   */
  async delete(id) {
    try {
      const trimestre = await this.getById(id);
      await trimestre.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * دالة مخصصة لعملية الـ Bulk Create (تستخدم في الـ Seed)
   */
  async bulkCreateOrUpdate(data) {
    try {
      return await Trimestre.bulkCreate(data, {
        updateOnDuplicate: ["trimestre_name"]
      });
    } catch (error) {
      throw new Error("فشل في عملية التحديث الجماعي: " + error.message);
    }
  }
}

export default new TrimestreService();