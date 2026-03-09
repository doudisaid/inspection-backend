// routes/role.routes.js
import { Router } from "express";
import RoleController from "../controllers/role.controller.js";

const router = Router();

// GET all roles
router.get("/", RoleController.getAllRoles);

// GET role by id
router.get("/:id", RoleController.getRoleById);

// POST create role
router.post("/", RoleController.createRole);

// PUT update role
router.put("/:id", RoleController.updateRole);

// DELETE role
router.delete("/:id", RoleController.deleteRole);

export default router;
