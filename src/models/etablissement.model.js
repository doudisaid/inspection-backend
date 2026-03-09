// models/etablissement.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // ✅ default import

const Etablissement = sequelize.define(
  "Etablissement",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    etabname: {        // ✅ تعديل الاسم ليطابق camelCase
      type: DataTypes.STRING,
      allowNull: false
    },
    idsecteur: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: "etablissements",
    timestamps: true,
    underscored: true
  }
);

export default Etablissement;
