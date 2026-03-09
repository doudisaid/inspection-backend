// services/year.service.js
import Year from "../models/year.model.js";

class YearService {
  // جلب كل السنوات مرتبة حسب الأحدث
  async getYears() {
    return await Year.findAll({
      order: [['id', 'DESC']] 
    });
  }

  // جلب سنة محددة
  async getYear(id) {
    const year = await Year.findByPk(id);
    if (!year) throw new Error("السنة الدراسية غير موجودة");
    return year;
  }

  // إضافة سنة جديدة
  async addYear(data) {
    // الـ Hook في الموديل سيتكفل بجعل بقية السنوات false إذا كان status: true
    return await Year.create(data);
  }

// تحديث بيانات السنة
  async updateYear(id, data) {
    // 1. جلب السجل أولاً للتأكد من وجوده
    const year = await Year.findByPk(id);
    
    if (!year) {
      throw new Error("لم يتم العثور على السنة الدراسية المطلوبة");
    }

    await year.update(data);

    return { success: true };
  }

  // حذف سنة
  async deleteYear(id) {
    const deleted = await Year.destroy({ where: { id } });
    if (!deleted) throw new Error("السنة غير موجودة أو تم حذفها مسبقاً");
    return { success: true };
  }

  // خدمة إضافية مفيدة: جلب السنة النشطة حالياً فقط
  async getActiveYear() {
    return await Year.findOne({ where: { status: true } });
  }
}

export default new YearService();