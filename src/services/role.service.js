// services/role.service.js
import Role from "../models/role.model.js";

class RoleService {
  async getAllRoles() {
    return await Role.findAll();
  }

  async getRoleById(id) {
    return await Role.findByPk(id);
  }

  async createRole(data) {
    if (!data.rolename) throw new Error("rolename is required");
    return await Role.create(data);
  }

  async updateRole(id, data) {
    const role = await Role.findByPk(id);
    if (!role) return null;

    await role.update(data);
    return role;
  }

  async deleteRole(id) {
    const role = await Role.findByPk(id);
    if (!role) return null;

    await role.destroy();
    return role;
  }
}

export default new RoleService();
