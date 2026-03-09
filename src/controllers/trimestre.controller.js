import Trimestre from "../models/trimestre.model.js";

const TrimestreController = {
  // 1. جلب كل الثلاثيات
  getAllTrimestres: async (req, res) => {
    try {
      const trimestres = await Trimestre.findAll({
        order: [['id', 'ASC']] // ترتيبهم حسب المعرف تصاعدياً
      });
      res.status(200).json(trimestres);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "خطأ في جلب البيانات", 
        error: error.message 
      });
    }
  },

  // 2. جلب ثلاثي محدد بواسطة ID
  getTrimestreById: async (req, res) => {
    try {
      const { id } = req.params;
      const trimestre = await Trimestre.findByPk(id);
      
      if (!trimestre) {
        return res.status(404).json({ 
          success: false, 
          message: "الثلاثي المطلوب غير موجود" 
        });
      }
      
      res.status(200).json(trimestre);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "خطأ في جلب بيانات الثلاثي", 
        error: error.message 
      });
    }
  },

  // 3. إضافة ثلاثي جديد
  createTrimestre: async (req, res) => {
    try {
      const { id, trimestre_name } = req.body;
      
      // التأكد من عدم وجود بيانات ناقصة
      if (!id || !trimestre_name) {
        return res.status(400).json({ message: "يرجى تقديم المعرف والاسم" });
      }

      const newTrimestre = await Trimestre.create({ id, trimestre_name });
      res.status(201).json({
        success: true,
        message: "تم إضافة الثلاثي بنجاح",
        data: newTrimestre
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: "فشل إنشاء الثلاثي", 
        error: error.message 
      });
    }
  },

  // 4. تحديث بيانات ثلاثي
  updateTrimestre: async (req, res) => {
    try {
      const { id } = req.params;
      const { trimestre_name } = req.body;

      const trimestre = await Trimestre.findByPk(id);
      if (!trimestre) {
        return res.status(404).json({ message: "الثلاثي غير موجود لتحديثه" });
      }

      await trimestre.update({ trimestre_name });
      res.status(200).json({
        success: true,
        message: "تم التحديث بنجاح",
        data: trimestre
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: "فشل تحديث الثلاثي", 
        error: error.message 
      });
    }
  },

  // 5. حذف ثلاثي
  deleteTrimestre: async (req, res) => {
    try {
      const { id } = req.params;
      const trimestre = await Trimestre.findByPk(id);

      if (!trimestre) {
        return res.status(404).json({ message: "الثلاثي غير موجود لحذفه" });
      }

      await trimestre.destroy();
      res.status(200).json({
        success: true,
        message: "تم حذف الثلاثي بنجاح"
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "حدث خطأ أثناء الحذف", 
        error: error.message 
      });
    }
  }
};

export default TrimestreController;