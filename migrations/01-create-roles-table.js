// migrations/20260220000007-create-roles.js
'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.STRING(1), // حرف واحد كمعرف (مثل '1', '2' أو 'A', 'B')
        primaryKey: true,
        allowNull: false
      },
      role_name: { // تقابل rolename في الموديل بسبب underscored: true
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('roles');
  }
};