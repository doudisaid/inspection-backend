import VacanceService from "../services/vacance.service.js";

class VacanceController {

  async getVacances(req, res) {
    try {
      const data = await VacanceService.getVacances();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب البيانات", error: error.message });
    }
  }

  async getVacance(req, res) {
    try {
      const data = await VacanceService.getVacance(req.params.id);
      res.json(data);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async addVacance(req, res) {
    try {
      const data = await VacanceService.addVacance(req.body);
      res.status(201).json({ message: "تمت الإضافة بنجاح", data });
    } catch (error) {
      res.status(400).json({ message: "خطأ في الإضافة", error: error.message });
    }
  }

  async updateVacance(req, res) {
    try {
      const data = await VacanceService.updateVacance(req.params.id, req.body);
      res.json({ message: "تم التحديث بنجاح", data });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteVacance(req, res) {
    try {
      await VacanceService.deleteVacance(req.params.id);
      res.json({ message: "تم الحذف بنجاح" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new VacanceController();