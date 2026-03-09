import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Level = sequelize.define("Level", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  level_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  tableName: "levels",
  timestamps: false,
  underscored: true
});

export default Level;
