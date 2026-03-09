import express from "express";
import VacanceCalendarController from "../controllers/vacance-calendar.controller.js";

const router = express.Router();

// الرابط: GET /api/vacance-calendar
router.get("/", VacanceCalendarController.getAll);

// الرابط: GET /api/vacance-calendar/year/:yearId
router.get("/year/:yearId", VacanceCalendarController.getByYear);

// الروابط الأساسية: ID
router.get("/:id", VacanceCalendarController.getOne);
router.post("/", VacanceCalendarController.create);
router.put("/:id", VacanceCalendarController.update);
router.delete("/:id", VacanceCalendarController.delete);

export default router;