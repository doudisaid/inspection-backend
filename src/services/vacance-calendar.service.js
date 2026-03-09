import VacanceCalendar from "../models/vacance-calendar.model.js";
import Vacance from "../models/vacance.model.js";
import Trimestre from "../models/trimestre.model.js";

class VacanceCalendarService {
  
  // دالة موحدة لتعريف العلاقات لتجنب التكرار
  get inclusions() {
    return [
      { model: Vacance, as: 'Vacance' },
      { model: Trimestre, as: 'Trimestre' }
    ];
  }

  // جلب كل تقويم العطل مع الأسماء
  async getAll() {
    try {
      return await VacanceCalendar.findAll({
        include: this.inclusions,
        order: [['begin_date', 'ASC']]
      });
    } catch (error) {
      throw new Error("خطأ في جلب تقويم العطل: " + error.message);
    }
  }

  // جلب تقويم العطل لسنة دراسية محددة مع الأسماء
  async getByYear(yearId) {
    try {
      return await VacanceCalendar.findAll({
        where: { year_id: yearId },
        include: this.inclusions,
        order: [['begin_date', 'ASC']]
      });
    } catch (error) {
      throw new Error("خطأ في جلب عطل السنة المحددة: " + error.message);
    }
  }

  // جلب سجل تقويم واحد مع الأسماء
  async getById(id) {
    try {
      const data = await VacanceCalendar.findByPk(id, {
        include: this.inclusions
      });
      if (!data) throw new Error("سجل التقويم غير موجود");
      return data;
    } catch (error) {
      throw error;
    }
  }

  // إضافة سجل جديد وإعادة الكائن كاملاً مع الأسماء فوراً
  async create(payload) {
    try {
      const newRecord = await VacanceCalendar.create(payload);
      // بعد الإضافة، نقوم بجلبه مجدداً مع علاقاته ليظهر في الجدول فوراً
      return await this.getById(newRecord.id);
    } catch (error) {
      throw new Error("فشل إضافة السجل للتقويم: " + error.message);
    }
  }

  // تحديث سجل تقويم وإعادة البيانات المحدثة مع الأسماء
  async update(id, payload) {
    try {
      const item = await VacanceCalendar.findByPk(id);
      if (!item) throw new Error("سجل التقويم غير موجود");
      
      await item.update(payload);
      // جلب البيانات بعد التحديث مع العلاقات
      return await this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  // حذف سجل من التقويم
  async delete(id) {
    try {
      const item = await VacanceCalendar.findByPk(id);
      if (!item) throw new Error("سجل التقويم غير موجود");
      return await item.destroy();
    } catch (error) {
      throw error;
    }
  }
}

export default new VacanceCalendarService();