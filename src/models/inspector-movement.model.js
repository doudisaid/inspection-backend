import { DataTypes, Op } from "sequelize";
import sequelize from "../config/database.js";

const InspectorMovement = sequelize.define("InspectorMovement", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // تحديد field صراحة يقطع الشك باليقين ويجبر Sequelize على استخدام هذا الاسم في SQL
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id', 
    references: { model: 'users', key: 'id' }
  },
  idsecteur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'idsecteur',
    references: { model: 'secteurs', key: 'id' }
  },
  year_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'year_id',
    references: { model: 'years', key: 'id' }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'note'
  }
}, {
  tableName: 'inspector_movements',
  underscored: true, // سيتعامل مع created_at و updated_at تلقائياً
  timestamps: true
});

// --- الـ Hooks (تأكد من تمرير الـ transaction دوماً) ---

InspectorMovement.beforeCreate(async (movement, options) => {
  if (movement.is_active) {
    // إغلاق أي مفتش نشط سابق في نفس المقاطعة
    await InspectorMovement.update(
      { is_active: false },
      {
        where: {
          idsecteur: movement.idsecteur,
          is_active: true
        },
        transaction: options.transaction, 
        hooks: false 
      }
    );
  }
});

export default InspectorMovement;