import { Router } from "express";
import WillayaController from "../controllers/willaya.controller.js";

const router = Router();

router.get("/", WillayaController.getWillayas);
router.post("/", WillayaController.addWillaya);
router.get("/:id", WillayaController.getWillaya);
router.delete("/:id", WillayaController.deleteWillaya);
router.put("/:id", WillayaController.updateWillaya);

export default router;
