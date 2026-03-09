// models/daira.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // ✅ default import

const Daira = sequelize.define(
  "Daira",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    dairaname: {        // ✅ تعديل الاسم ليطابق camelCase
      type: DataTypes.STRING,
      allowNull: false
    },
    idwillaya: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: "dairas",
    timestamps: true,
    underscored: true
  }
);

export default Daira;
