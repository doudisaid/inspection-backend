// migrations/20260220000003-create-secteurs.js
'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('secteurs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      secteur_name: { // تقابل secteurname في الموديل
        type: Sequelize.STRING,
        allowNull: false
      },
      id_commune: { // تقابل idcommune في الموديل
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'communes', // اسم جدول البلديات في قاعدة البيانات
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
    await queryInterface.dropTable('secteurs');
  }
};