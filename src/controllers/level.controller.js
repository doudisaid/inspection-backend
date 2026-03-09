// controllers/level.controller.js
import LevelService from "../services/level.service.js";

class LevelController {
  async getAllLevels(req, res) {
    try {
      const levels = await LevelService.getAllLevels();
      res.json(levels);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getLevelById(req, res) {
    try {
      const { id } = req.params;
      const level = await LevelService.getLevelById(id);

      if (!level) return res.status(404).json({ message: "Level not found" });

      res.json(level);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createLevel(req, res) {
    try {
      const level = await LevelService.createLevel(req.body);
      res.status(201).json(level);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateLevel(req, res) {
    try {
      const { id } = req.params;
      const level = await LevelService.updateLevel(id, req.body);

      if (!level) return res.status(404).json({ message: "Level not found" });

      res.json(level);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteLevel(req, res) {
    try {
      const { id } = req.params;
      const level = await LevelService.deleteLevel(id);

      if (!level) return res.status(404).json({ message: "Level not found" });

      res.json({ message: "Level deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new LevelController();

