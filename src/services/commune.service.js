import Commune from "../models/commune.model.js";
import Daira from "../models/daira.model.js";

class CommuneService {
// داخل ملف التميز (Service)
async getAllCommunes(willaya_id = null) {
        try {
            const queryOptions = {
                include: [{
                    model: Daira,
                    required: true,
                    // استخدمنا idwillaya لأن هذا هو المسمى في ملف العلاقات لديك
                    where: {} 
                }]
            };

            // تفعيل الفلترة فقط إذا تم إرسال willaya_id
            if (willaya_id && willaya_id !== 'null' && willaya_id !== 'undefined') {
                queryOptions.include[0].where = { idwillaya: willaya_id };
            }

            // تنفيذ الاستعلام
            const communes = await Commune.findAll(queryOptions);
            return communes;
        } catch (error) {
            // سيطبع الخطأ الحقيقي هنا إذا وجد
            console.error("Error inside Service Method:", error.message);
            throw error;
        }
    }

  async createCommune(data) {
    // يمكن إضافة تحقق من البيانات هنا
    return await Commune.create(data);
  }

  async getCommuneById(id) {
    return await Commune.findByPk(id);
  }

  async deleteCommune(id) {
    const commune = await Commune.findByPk(id);
    if (!commune) return null;

    await commune.destroy();
    return commune;
  }

  async updateCommune(id, data) {
    const commune = await Commune.findByPk(id);
    if (!commune) return null;

    await commune.update(data);
    return commune;
  }

  async getCommunesByDaira(iddaira) {
    return await Commune.findAll({ where: { iddaira } });
  }
}

export default new CommuneService();
