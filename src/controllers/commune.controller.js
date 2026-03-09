import CommuneService from "../services/commune.service.js";

class CommuneController {
  // جلب كل البلديات
async getCommunes(req, res) {
    try {
        const { willaya_id } = req.query;
        const communes = await CommuneService.getAllCommunes(willaya_id);
        return res.json(communes);
    } catch (error) {
        return res.status(500).json({ error: "حدث خطأ أثناء جلب البلديات" });
    }
}

  // إضافة بلدية جديدة
  async addCommune(req, res) {
    try {
      const commune = await CommuneService.createCommune(req.body);
      res.status(201).json(commune);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Invalid commune data" });
    }
  }

  // جلب بلدية واحدة
  async getCommune(req, res) {
    try {
      const { id } = req.params;
      const commune = await CommuneService.getCommuneById(id);

      if (!commune) return res.status(404).json({ message: "Commune not found" });

      res.json(commune);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // حذف بلدية
  async deleteCommune(req, res) {
    try {
      const { id } = req.params;
      const commune = await CommuneService.deleteCommune(id);

      if (!commune) return res.status(404).json({ message: "Commune not found" });

      res.json({ message: "Commune deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // تحديث بلدية
  async updateCommune(req, res) {
    try {
      const { id } = req.params;
      const commune = await CommuneService.updateCommune(id, req.body);

      if (!commune) return res.status(404).json({ message: "Commune not found" });

      res.json(commune);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Invalid update data" });
    }
  }

  // جلب البلديات التابعة لدائرة معينة
  async getCommunesByDaira(req, res) {
    try {
      const { iddaira } = req.params;
      const communes = await CommuneService.getCommunesByDaira(iddaira);
      res.json(communes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new CommuneController();
