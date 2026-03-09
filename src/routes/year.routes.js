// routes/year.routes.js
import { Router } from "express";
import YearController from "../controllers/year.controller.js";

const router = Router();

// 1. أضف هذا السطر هنا (فوق المسارات التي تحتوي على :id)
router.get("/active", YearController.getActiveYear);

// 2. باقي المسارات كما هي
router.get("/", YearController.getYears);
router.get("/:id", YearController.getYear);
router.post("/", YearController.addYear);
router.put("/:id", YearController.updateYear);
router.delete("/:id", YearController.deleteYear);

export default router;