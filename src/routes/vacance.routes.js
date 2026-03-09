import express from "express";
import VacanceController from "../controllers/vacance.controller.js";

const router = express.Router();

// جلب كل أنواع العطل (خريف، شتاء، إلخ)
router.get("/", VacanceController.getVacances);

// تم حذف مسار /year/:yearId مؤقتاً لأن الدالة غير موجودة في الـ Controller
// وإذا تركتها وهي undefined سيتوقف السيرفر عن العمل

// جلب عطلة واحدة بواسطة المعرف
router.get("/:id", VacanceController.getVacance);

// إضافة نوع عطلة جديد
router.post("/", VacanceController.addVacance);

// تحديث اسم عطلة
router.put("/:id", VacanceController.updateVacance);

// حذف عطلة
router.delete("/:id", VacanceController.deleteVacance);

export default router;