// migrations/20260220000004-create-etablissements.js
'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('etablissements', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      etab_name: { // تقابل etabname في الموديل
        type: Sequelize.STRING,
        allowNull: false
      },
      id_secteur: { // تقابل idsecteur في الموديل
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'secteurs', // اسم الجدول الذي يتبع له (القطاعات)
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('etablissements');
  }
};