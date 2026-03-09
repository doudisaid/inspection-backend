// routes/level.routes.js
import { Router } from "express";
import LevelController from "../controllers/level.controller.js";

const router = Router();

// GET all levels
router.get("/", LevelController.getAllLevels);

// GET level by id
router.get("/:id", LevelController.getLevelById);

// POST create level
router.post("/", LevelController.createLevel);

// PUT update level
router.put("/:id", LevelController.updateLevel);

// DELETE level
router.delete("/:id", LevelController.deleteLevel);

export default router;
