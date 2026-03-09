'use strict';
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vacances', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      vacance_name: { type: Sequelize.STRING, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => await queryInterface.dropTable('vacances')
};