// migrations/20260220000011-create-years.js
'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('years', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      year_name: { // تقابل yearname في الموديل
        type: Sequelize.STRING,
        allowNull: false
      },
      status: { // حالة السنة (نشطة أم لا)
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('years');
  }
};