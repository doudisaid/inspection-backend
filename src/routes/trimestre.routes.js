// routes/trimestre.routes.js
import { Router } from "express";
import TrimestreController from "../controllers/trimestre.controller.js";

const router = Router();

router.get("/", TrimestreController.getAllTrimestres);
router.get("/:id", TrimestreController.getTrimestreById);
router.post("/", TrimestreController.createTrimestre);
router.put("/:id", TrimestreController.updateTrimestre);
router.delete("/:id", TrimestreController.deleteTrimestre);

export default router;