import Willaya from "../models/willaya.model.js";

class WillayaService {
  async getAllWillayas() {
    return await Willaya.findAll();
  }

async createWillaya(data) {
 
  if (!data.willayaname || !data.id) {
    throw new Error("Missing required fields: id and willayaname are required");
  }
  return await Willaya.create(data);
}

  async getWillayaById(id) {
    return await Willaya.findByPk(id);
  }

  async deleteWillaya(id) {
    const willaya = await Willaya.findByPk(id);
    if (!willaya) return null;

    await willaya.destroy();
    return willaya;
  }

  async updateWillaya(id, data) {
    const willaya = await Willaya.findByPk(id);
    if (!willaya) return null;

    await willaya.update(data);
    return willaya;
  }
}

export default new WillayaService();
