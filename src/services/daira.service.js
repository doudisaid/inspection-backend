import Daira from "../models/daira.model.js";

class DairaService {
  async getAllDairas() {
    return await Daira.findAll();
  }

  async createDaira(data) {
    // يمكن إضافة Validation للبيانات هنا
    return await Daira.create(data);
  }

  async getDairaById(id) {
    return await Daira.findByPk(id);
  }

  async deleteDaira(id) {
    const daira = await Daira.findByPk(id);
    if (!daira) return null;

    await daira.destroy();
    return daira;
  }

  async updateDaira(id, data) {
    const daira = await Daira.findByPk(id);
    if (!daira) return null;

    await daira.update(data);
    return daira;
  }

  async getDairasByWillaya(willayaId) {
    return await Daira.findAll({ where: { idwillaya: willayaId } });
  }
}

export default new DairaService();
