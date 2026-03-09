import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.STRING(1),
    primaryKey: true
  },
  role_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  tableName: "roles",
  timestamps: false,
  underscored: true
});

export default Role;
