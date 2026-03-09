// migrations/20260220000009-create-users.js
'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      username: { 
        type: Sequelize.STRING, 
        allowNull: true, 
        defaultValue: null
      },
      name: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      email: { 
        type: Sequelize.STRING, 
        allowNull: true, 
        unique: true 
      },
      phone: { 
        type: Sequelize.STRING, 
        allowNull: true, 
        unique: true 
      },
      password: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      role_id: { 
        type: Sequelize.STRING(1), 
        allowNull: false, 
        defaultValue: "3",
        references: {
          model: 'roles', // الربط بجدول الأدوار
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      googleId: { 
        type: Sequelize.STRING, 
        allowNull: true, 
        unique: true 
      },
      provider: { 
        type: Sequelize.STRING, 
        allowNull: false, 
        defaultValue: "local" 
      },
      avatar: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      password_reset_attempts: { // استخدام الاسم المحدد في field
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      last_password_reset_request: { // استخدام الاسم المحدد في field
        type: Sequelize.DATE,
        allowNull: true
      },
      willaya_id: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: {
          model: 'willayas', // الربط بجدول الولايات
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      resetPasswordExpires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  }
};