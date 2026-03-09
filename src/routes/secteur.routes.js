import { Router } from "express";
import SecteurController from "../controllers/secteur.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js"; 

const router = Router();

/**
 * جميع المسارات أدناه محمية بـ middleware المصادقة
 * سيتم الوصول إليها عبر الرابط: /api/secteurs
 */
router.use(authenticate); 

// --- 1. المسارات الأساسية (Basic CRUD) ---

// جلب كل المقاطعات
router.get("/", SecteurController.getSecteurs);

// إضافة مقاطعة جديدة
router.post("/", SecteurController.addSecteur);

// --- 2. المسارات المتخصصة (Specialized Routes) ---

// تغيير أو تعيين مفتش لمقاطعة (وضعناه قبل :id لتجنب التداخل)
router.post("/change-inspector", SecteurController.changeInspector); 

// جلب المقاطعات حسب البلدية
router.get("/commune/:communeId", SecteurController.getSecteursByCommune);

// --- 3. المسارات المرتبطة بمعرف المقاطعة (:id) ---

// جلب سجل تحركات المفتشين لمقاطعة معينة (تمت إضافته هنا)
router.get("/:id/history", SecteurController.getSecteurHistory); 

// جلب بيانات مقاطعة واحدة بالتفصيل
router.get("/:id", SecteurController.getSecteur); 

// تحديث بيانات مقاطعة
router.put("/:id", SecteurController.updateSecteur);

// حذف مقاطعة
router.delete("/:id", SecteurController.deleteSecteur);

export default router;