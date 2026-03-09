import EtablissementService from "../services/etablissement.service.js";

class EtablissementController {
  // جلب كل المؤسسات
  async getEtablissements(req, res) {
    try {
      const etabs = await EtablissementService.getAllEtablissements();
      res.json(etabs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // جلب مؤسسة واحدة
  async getEtablissement(req, res) {
    try {
      const { id } = req.params;
      const etab = await EtablissementService.getEtablissementById(id);
      if (!etab) return res.status(404).json({ message: "Etablissement not found" });
      res.json(etab);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // إضافة مؤسسة جديدة
  async addEtablissement(req, res) {
    try {
      const newEtab = await EtablissementService.createEtablissement(req.body);
      res.status(201).json(newEtab);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message || "Invalid data" });
    }
  }

  // تحديث مؤسسة
  async updateEtablissement(req, res) {
    try {
      const { id } = req.params;
      const updated = await EtablissementService.updateEtablissement(id, req.body);
      res.json(updated);
    } catch (error) {
      console.error(error);
      if (error.message === "Etablissement not found") {
        res.status(404).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Invalid update data" });
      }
    }
  }

  // حذف مؤسسة
  async deleteEtablissement(req, res) {
    try {
      const { id } = req.params;
      await EtablissementService.deleteEtablissement(id);
      res.json({ message: "Deleted successfully" });
    } catch (error) {
      console.error(error);
      if (error.message === "Etablissement not found") {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

    // جلب المؤسسات التابعة لدائرة مقاطعة
  async getEtablissementBySecteur(req, res) {
    try {
      const { secteurId } = req.params;
      const etablissements = await EtablissementService.getEtablissementsBySecteur(secteurId);
      res.json(etablissements);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

}

export default new EtablissementController();
