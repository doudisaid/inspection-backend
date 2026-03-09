// controllers/role.controller.js
import RoleService from "../services/role.service.js";

class RoleController {
  async getAllRoles(req, res) {
    try {
      const roles = await RoleService.getAllRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRoleById(req, res) {
    try {
      const { id } = req.params;
      const role = await RoleService.getRoleById(id);

      if (!role) return res.status(404).json({ message: "Role not found" });

      res.json(role);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createRole(req, res) {
    try {
      const role = await RoleService.createRole(req.body);
      res.status(201).json(role);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const role = await RoleService.updateRole(id, req.body);

      if (!role) return res.status(404).json({ message: "Role not found" });

      res.json(role);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteRole(req, res) {
    try {
      const { id } = req.params;
      const role = await RoleService.deleteRole(id);

      if (!role) return res.status(404).json({ message: "Role not found" });

      res.json({ message: "Role deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new RoleController();
