// models/trimestre.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // تأكد من إضافة .js في النهاية

const Trimestre = sequelize.define('Trimestre', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  trimestre_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'trimestres',
  timestamps: false,
  underscored: true // لإبقاء التناسق مع بقية الجداول
});

export default Trimestre; // 👈 هذا هو السطر الذي كان ينقصك