// migrations/20260220000006-create-levels.js
'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('levels', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      level_name: { // تقابل levelname في الموديل بسبب underscored: true
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('levels');
  }
};