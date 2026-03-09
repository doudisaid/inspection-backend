import VacanceCalendarService from "../services/vacance-calendar.service.js";

class VacanceCalendarController {
  async getAll(req, res) {
    try {
      const data = await VacanceCalendarService.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getByYear(req, res) {
    try {
      const { yearId } = req.params;
      const data = await VacanceCalendarService.getByYear(yearId);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const data = await VacanceCalendarService.getById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

async create(req, res) {
    try {
      // 1. إضافة السجل الجديد
      const createdRecord = await VacanceCalendarService.create(req.body);
      
      // 2. جلب السجل مرة أخرى مع العلاقات (Eager Loading) لضمان ظهور الأسماء
      // ملاحظة: يجب أن تكون دالة getById في Service تدعم "include"
      const data = await VacanceCalendarService.getById(createdRecord.id);
      console.log(data)
      res.status(201).json({ 
        success: true, 
        message: "تمت الإضافة بنجاح", 
        data // الآن ستحتوي data على كائنات Vacance و Trimestre
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async update(req, res) {
    try {
      await VacanceCalendarService.update(req.params.id, req.body);
      
      // جلب البيانات المحدثة مع علاقاتها
      const data = await VacanceCalendarService.getById(req.params.id);
      console.log(data)
      res.status(200).json({ 
        success: true, 
        message: "تم التحديث بنجاح", 
        data 
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await VacanceCalendarService.delete(req.params.id);
      res.status(200).json({ success: true, message: "تم الحذف من التقويم" });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

export default new VacanceCalendarController();