import SecteursService from "../services/secteur.service.js"; 

class SecteurController {
  
  // 1. جلب كل المقاطعات مفلترة بالولاية
  static async getSecteurs(req, res) {
    try {
      const userWillayaId = req.user?.willaya_id;
      if (!userWillayaId) {
        return res.status(403).json({ success: false, message: "غير مصرح لك: لا توجد ولاية مرتبطة بحسابك" });
      }

      const secteurs = await SecteursService.getAllSecteurs(userWillayaId);
      res.json({ success: true, data: secteurs });
    } catch (error) {
      console.error("Controller Error (getSecteurs):", error.message);
      res.status(500).json({ success: false, message: "خطأ في جلب البيانات" });
    }
  }

  // 2. جلب مقاطعة واحدة (تم تصحيح المنطق هنا)
  static async getSecteur(req, res) {
    try {
      const { id } = req.params;
      
      // بدلاً من البحث بالبلدية، نبحث بالمعرف الفريد للمقاطعة
      // ملاحظة: إذا لم تكن هذه الدالة موجودة في الـ Service، يمكنك استخدام findAll مع id
      const secteurs = await SecteursService.getAllSecteurs(req.user.willaya_id);
      const secteur = secteurs.find(s => s.id == id);
      
      if (!secteur) {
        return res.status(404).json({ success: false, message: "المقاطعة غير موجودة أو خارج نطاق ولايتك" });
      }

      res.json({ success: true, data: secteur });
    } catch (error) {
      console.error("Controller Error (getSecteur):", error.message);
      res.status(500).json({ success: false, message: "خطأ في جلب بيانات المقاطعة" });
    }
  }

  // 3. إضافة مقاطعة جديدة
  static async addSecteur(req, res) {
    try {
      const { secteurname, idcommune, user_id } = req.body;
      
      if (!secteurname || !idcommune) {
        return res.status(400).json({ success: false, message: "يرجى تقديم اسم المقاطعة والبلدية" });
      }

      const secteur = await SecteursService.createSecteur({ 
        secteurname, 
        idcommune, 
        user_id 
      });

      res.status(201).json({ 
        success: true, 
        data: secteur, 
        message: "تم إنشاء المقاطعة وتعيين المفتش بنجاح" 
      });
    } catch (error) {
      console.error("Controller Error (addSecteur):", error.message);
      res.status(400).json({ success: false, message: "فشل في الإضافة", error: error.message });
    }
  }

  // 4. تحديث بيانات مقاطعة
  static async updateSecteur(req, res) {
    try {
      const updatedSecteur = await SecteursService.updateSecteur(req.params.id, req.body);
      
      if (!updatedSecteur) {
        return res.status(404).json({ success: false, message: "المقاطعة غير موجودة" });
      }
      
      res.json({ success: true, data: updatedSecteur, message: "تم التحديث بنجاح" });
    } catch (error) {
      console.error("Controller Error (updateSecteur):", error.message);
      res.status(400).json({ success: false, message: "خطأ في التحديث", error: error.message });
    }
  }

  // 5. نقل المفتش (حركة تنقلية)
  static async changeInspector(req, res) {
    try {
      const { userId, secteurId, note } = req.body;

      if (!userId || !secteurId) {
        return res.status(400).json({ 
          success: false, 
          message: "يجب تحديد المفتش والمقاطعة المستهدفة" 
        });
      }

      const result = await SecteursService.moveInspector(
        Number(userId), 
        Number(secteurId), 
        note || "نقل تنقلي"
      );

      res.json({
        success: true,
        message: "تم تحديث حركة المفتش بنجاح وتوثيقها في السجل",
        data: result
      });

    } catch (error) {
      console.error("Controller Error (changeInspector):", error.message);
      res.status(500).json({ 
        success: false, 
        message: "فشل في إتمام عملية النقل",
        error: error.message 
      });
    }
  }

  // 6. حذف مقاطعة
  static async deleteSecteur(req, res) {
    try {
      const deleted = await SecteursService.deleteSecteur(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "المقاطعة غير موجودة" });
      }
      res.json({ success: true, message: "تم الحذف بنجاح" });
    } catch (error) {
      console.error("Controller Error (deleteSecteur):", error.message);
      res.status(500).json({ success: false, message: "خطأ في الحذف" });
    }
  }

  // 7. جلب مقاطعات بلدية معينة
  static async getSecteursByCommune(req, res) {
    try {
      const secteurs = await SecteursService.getSecteursByCommune(req.params.communeId);
      res.json({ success: true, data: secteurs });
    } catch (error) {
      console.error("Controller Error (getSecteursByCommune):", error.message);
      res.status(500).json({ success: false, message: "خطأ في جلب بيانات البلدية" });
    }
  }

  // 8. جلب سجل تحركات المفتشين لمقاطعة معينة
  static async getSecteurHistory(req, res) {
    try {
      const { id } = req.params; // الحصول على معرف المقاطعة من الرابط

      // استدعاء الخدمة (SecteursService) لجلب البيانات من قاعدة البيانات
      const history = await SecteursService.getSecteurHistory(id);

      // الرد على الواجهة الأمامية بالبيانات
      res.json({ 
        success: true, 
        data: history 
      });
    } catch (error) {
      console.error("Controller Error (getSecteurHistory):", error.message);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب سجل التحركات للمقاطعة" 
      });
    }
  }
}

export default SecteurController;