import * as movementService from "../services/inspector-movement.service.js";

export const createMovement = async (req, res) => {
  try {
    const { user_id, idsecteur, year_id, note } = req.body;

    // التحقق من وجود البيانات الأساسية
    if (!user_id || !idsecteur || !year_id) {
      return res.status(400).json({ message: "جميع الحقول الأساسية مطلوبة" });
    }

    const movement = await movementService.assignInspectorToSecteur({
      user_id,
      idsecteur,
      year_id,
      note
    });

    res.status(201).json({
      success: true,
      message: "تمت عملية نقل المفتش بنجاح",
      data: movement
    });
  } catch (error) {
    console.error("Error in createMovement:", error);
    res.status(500).json({ 
      success: false, 
      message: "حدث خطأ أثناء معالجة حركة النقل",
      error: error.message 
    });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await movementService.getInspectorHistory(userId);
    
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};