// تم تصحيح المسار ليتوافق مع الموديل الفعلي الذي تملكه
import Vacance from "../models/vacance.model.js"; 

class VacanceService {

  // جلب كل العطلات
  async getVacances() {
    return await Vacance.findAll({ 
      // الترتيب حسب الـ id لأن begindate غير موجود في الموديل أعلاه
      order: [['id', 'ASC']] 
    });
  }

  // جلب سجل واحد
  async getVacance(id) {
    const data = await Vacance.findByPk(id);
    if (!data) throw new Error("السجل غير موجود");
    return data;
  }

  // إضافة عطلة جديدة (مثل "عطلة الصيف")
  async addVacance(payload) {
    try {
      return await Vacance.create(payload);
    } catch (error) {
      throw error;
    }
  }

  // تحديث عطلة
  async updateVacance(id, payload) {
    const item = await Vacance.findByPk(id);
    if (!item) throw new Error("السجل غير موجود");
    return await item.update(payload);
  }

  // حذف عطلة
  async deleteVacance(id) {
    const item = await Vacance.findByPk(id);
    if (!item) throw new Error("السجل غير موجود");
    return await item.destroy();
  }
  
  // ملاحظة: دالة getVacancesByYear تتطلب موديل مختلف يحتوي على تاريخ وسنة
  // إذا كنت تريد العمل بجدول vacances الحالي، يجب حذف منطق السنوات منه.
}

export default new VacanceService();