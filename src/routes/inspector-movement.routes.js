import express from "express";
import * as movementController from "../controllers/inspector-movement.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @route   POST /api/movements/assign
 * @desc    إنشاء حركة نقل جديدة للمفتشين
 * @access  Private (رئيس المصلحة فقط - Role ID: 1)
 */
router.post(
    "/assign", 
    authenticate, 
    authorize([1]), // السماح حصرياً لصاحب الرمز 1 (رئيس المصلحة)
    movementController.createMovement
);

/**
 * @route   GET /api/movements/history/:userId
 * @desc    جلب تاريخ الحركات التنقلية لمفتش معين
 * @access  Private (مستخدم مسجل)
 */
router.get(
    "/history/:userId", 
    authenticate, 
    movementController.getUserHistory
);

export default router;