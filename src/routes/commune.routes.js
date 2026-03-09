import { Router } from "express";
import CommuneController from "../controllers/commune.controller.js";

const router = Router();

// جلب كل البلديات
router.get("/", CommuneController.getCommunes);

// جلب بلدية واحدة
router.get("/:id", CommuneController.getCommune);

// إضافة بلدية جديدة
router.post("/", CommuneController.addCommune);

// تحديث بلدية
router.put("/:id", CommuneController.updateCommune);

// حذف بلدية
router.delete("/:id", CommuneController.deleteCommune);

// جلب البلديات التابعة لدائرة معينة
router.get("/daira/:iddaira", CommuneController.getCommunesByDaira);

export default router;
