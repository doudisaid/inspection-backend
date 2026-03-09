import Etablissement from "../models/etablissement.model.js";

class EtablissementService {
  async getAllEtablissements() {
    return await Etablissement.findAll();
  }

  async getEtablissementById(id) {
    return await Etablissement.findByPk(id);
  }

  async createEtablissement(data) {
    return await Etablissement.create(data);
  }

  async updateEtablissement(id, data) {
    const etab = await Etablissement.findByPk(id);
    if (!etab) throw new Error("Etablissement not found");
    return await etab.update(data);
  }

  async deleteEtablissement(id) {
    const etab = await Etablissement.findByPk(id);
    if (!etab) throw new Error("Etablissement not found");
    await etab.destroy();
    return etab;
  }

    async getEtablissementsBySecteur(SecteurId) {
    return await Etablissement.findAll({ where: { idsecteur: SecteurId } });
  }
}

export default new EtablissementService();
