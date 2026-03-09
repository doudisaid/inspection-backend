import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Vacance from "./vacance.model.js";
import Trimestre from "./trimestre.model.js";

const VacanceCalendar = sequelize.define('VacanceCalendar', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  begin_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  year_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'years', key: 'id' }
  },
  trimestre_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'trimestres', key: 'id' }
  },
  vacance_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'vacances', key: 'id' }
  }
}, {
  tableName: 'vacance_calendar',
  timestamps: true,
  underscored: true
});

// --- إضافة العلاقات (Associations) هنا ---
VacanceCalendar.belongsTo(Vacance, { foreignKey: 'vacance_id', as: 'Vacance' });
VacanceCalendar.belongsTo(Trimestre, { foreignKey: 'trimestre_id', as: 'Trimestre' });

export default VacanceCalendar;