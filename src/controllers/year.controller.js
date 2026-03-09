// controllers/year.controller.js
import YearService from "../services/year.service.js";

class YearController {

  async getYears(req, res) {
    try {
      const years = await YearService.getYears();
      res.json(years);
    } catch (error) {
      // معالجة الخطأ بشكل منظم
      res.status(500).json({ message: "فشل في جلب السنوات الدراسية", error: error.message });
    }
  }

  async getYear(req, res) {
    try {
      const { id } = req.params;
      const year = await YearService.getYear(id);
      // الملاحظة: الـ Service الآن يقوم برفع خطأ إذا لم يجد السنة، لذا سنكتفي بالاستجابة هنا
      res.json(year);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async addYear(req, res) {
    try {
      // req.body يجب أن يحتوي على { yearname, status }
      const newYear = await YearService.addYear(req.body);
      res.status(201).json({
        message: "تمت إضافة السنة الدراسية بنجاح",
        data: newYear
      });
    } catch (error) {
      res.status(400).json({ message: "فشل في إضافة السنة", error: error.message });
    }
  }

  async updateYear(req, res) {
    try {
      const { id } = req.params;
      // سيقوم الـ Service بتشغيل الـ Hooks لضمان سنة نشطة واحدة فقط
      await YearService.updateYear(id, req.body);
      res.json({ message: "تم تحديث السنة الدراسية بنجاح" });
    } catch (error) {
      res.status(400).json({ message: "فشل في التحديث", error: error.message });
    }
  }

  async deleteYear(req, res) {
    try {
      const { id } = req.params;
      await YearService.deleteYear(id);
      res.json({ message: "تم حذف السنة الدراسية بنجاح" });
    } catch (error) {
      res.status(400).json({ message: "فشل في الحذف", error: error.message });
    }
  }

  // دالة إضافية لجلب السنة النشطة مباشرة (مفيدة جداً للـ Frontend)
  async getActiveYear(req, res) {
    try {
      const activeYear = await YearService.getActiveYear();
      if (!activeYear) return res.status(404).json({ message: "لا توجد سنة نشطة حالياً" });
      res.json(activeYear);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new YearController();