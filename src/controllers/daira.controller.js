import DairaService from "../services/daira.service.js";

class DairaController {
  // جلب كل الدوائر
  async getDairas(req, res) {
    try {
      const dairas = await DairaService.getAllDairas();
      res.json(dairas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // إضافة دائرة جديدة
  async addDaira(req, res) {
    try {
      const daira = await DairaService.createDaira(req.body);
      res.status(201).json(daira);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Invalid daira data" });
    }
  }

  // جلب دائرة واحدة
  async getDaira(req, res) {
    try {
      const { id } = req.params;
      const daira = await DairaService.getDairaById(id);

      if (!daira) return res.status(404).json({ message: "Daira not found" });

      res.json(daira);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // حذف دائرة
  async deleteDaira(req, res) {
    try {
      const { id } = req.params;
      const daira = await DairaService.deleteDaira(id);

      if (!daira) return res.status(404).json({ message: "Daira not found" });

      res.json({ message: "Daira deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // تحديث دائرة
  async updateDaira(req, res) {
    try {
      const { id } = req.params;
      const daira = await DairaService.updateDaira(id, req.body);

      if (!daira) return res.status(404).json({ message: "Daira not found" });

      res.json(daira);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Invalid update data" });
    }
  }

  // جلب الدوائر التابعة لولاية معينة
  async getDairasByWillaya(req, res) {
    try {
      const { willayaId } = req.params;
      const dairas = await DairaService.getDairasByWillaya(willayaId);
      res.json(dairas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new DairaController();
