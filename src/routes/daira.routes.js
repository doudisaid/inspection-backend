import {Router} from "express";
import DairaController from "../controllers/daira.controller.js";

const router = Router();

// جلب كل الدوائر
router.get("/", DairaController.getDairas);

// جلب دائرة واحدة
router.get("/:id", DairaController.getDaira);

// إضافة دائرة جديدة
router.post("/", DairaController.addDaira);

// تحديث دائرة
router.put("/:id", DairaController.updateDaira);

// حذف دائرة
router.delete("/:id", DairaController.deleteDaira);

// جلب الدوائر التابعة لولاية
router.get("/willaya/:willayaId", DairaController.getDairasByWillaya);


export default router;
