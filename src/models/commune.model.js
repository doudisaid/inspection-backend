// models/commune.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // ✅ default import

const Commune = sequelize.define(
  "Commune",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    communename: {       // ✅ تعديل الاسم ليطابق camelCase
      type: DataTypes.STRING,
      allowNull: false
    },
    iddaira: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: "communes",
    timestamps: true,
    underscored: true
  }
);

export default Commune;
