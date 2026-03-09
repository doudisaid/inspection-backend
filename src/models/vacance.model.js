import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Vacance = sequelize.define('Vacance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vacance_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'vacances',
  timestamps: true,
  underscored: true
});

export default Vacance;