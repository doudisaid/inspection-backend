import WillayaService from "../services/willaya.service.js";

class WillayaController {
  async getWillayas(req, res) {
    try {
      const willayas = await WillayaService.getAllWillayas();
      res.json(willayas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async addWillaya(req, res) {
    try {
      const willaya = await WillayaService.createWillaya(req.body);
      res.status(201).json(willaya);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message || "Invalid data" });
    }
  }

  async getWillaya(req, res) {
    try {
      const { id } = req.params;
      const willaya = await WillayaService.getWillayaById(id);
      if (!willaya) return res.status(404).json({ message: "Willaya not found" });
      res.json(willaya);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteWillaya(req, res) {
    try {
      const { id } = req.params;
      const willaya = await WillayaService.deleteWillaya(id);
      if (!willaya) return res.status(404).json({ message: "Willaya not found" });
      res.json({ message: "Willaya deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateWillaya(req, res) {
    try {
      const { id } = req.params;
      const willaya = await WillayaService.updateWillaya(id, req.body);
      if (!willaya) return res.status(404).json({ message: "Willaya not found" });
      res.json(willaya);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message || "Invalid update data" });
    }
  }
}

export default new WillayaController();
