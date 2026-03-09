import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './user.model.js';

const ResetToken = sequelize.define('ResetToken', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: User,
      key: 'id',
    },
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'token',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at',
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'used',
  },
}, {
  tableName: 'reset_tokens',
  timestamps: true,
  underscored: true, // يجعل Sequelize يستخدم snake_case تلقائي
});

ResetToken.belongsTo(User, { foreignKey: 'userId' });

export default ResetToken;
