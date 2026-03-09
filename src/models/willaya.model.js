// models/willaya.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // ✅ استخدام default import

const Willaya = sequelize.define(
  "Willaya",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement:  false,
      primaryKey: true
    },
    willayaname: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "willayas",
    timestamps: true,
    underscored: true
  }
);

export default Willaya;
