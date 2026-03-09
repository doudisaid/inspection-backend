// models/secteur.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Secteur = sequelize.define(
  "Secteur",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    secteurname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idcommune: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // إضافة معرف المستخدم (المفتش)
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // يمكن أن تكون true إذا كانت المقاطعة قد تظل بدون مفتش لفترة
      references: {
        model: 'users', // يجب أن يتطابق مع اسم جدول المستخدمين
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL' // في حال حذف المستخدم، تبقى المقاطعة فارغة المفتش
    }
  },
  {
    tableName: "secteurs",
    timestamps: true,
    underscored: true
  }
);

export default Secteur;