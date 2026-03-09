// models/year.model.js
import { DataTypes, Op } from "sequelize"; // أضفنا Op هنا
import sequelize from "../config/database.js";

const Year = sequelize.define("year", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  yearname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  timestamps: true,
  underscored: true,
  freezeTableName: true, // 👈 أضف هذا السطر هنا أيضاً للتأكيد
  tableName: 'years'
});

// --- إضافة منطق السنة النشطة الواحدة (Hook) ---
Year.beforeSave(async (year, options) => {
  // إذا تم تعيين هذه السنة كنشطة (status: true)
  if (year.status) {
    // نقوم بتعطيل أي سنة أخرى نشطة في قاعدة البيانات
    await Year.update(
      { status: false },
      {
        where: {
          id: { [Op.ne]: year.id || 0 }, // استثناء السنة الحالية
          status: true // تحديث النشطين فقط لتقليل الضغط على قاعدة البيانات
        },
        hooks: false // ضروري جداً لمنع الدخول في حلقة تكرار لا نهائية
      }
    );
  }
});

export default Year;