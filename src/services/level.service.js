// services/role.service.js
import Level from "../models/level.model.js";

class LevelService {
  async getAllLevels() {
    return await Level.findAll();
  }

  async getLevelById(id) {
    return await Level.findByPk(id);
  }

  async createLevel(data) {
    if (!data.levelname) throw new Error("levelname is required");
    return await Level.create(data);
  }

  async updateLevel(id, data) {
    const level = await Level.findByPk(id);
    if (!level) return null;

    await level.update(data);
    return level;
  }

  async deleteLevel(id) {
    const level = await Level.findByPk(id);
    if (!level) return null;

    await level.destroy();
    return level;
  }
}

export default new LevelService();