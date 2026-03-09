// migrations/20260220000002-create-dairas.js
'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dairas', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      daira_name: { // تقابل dairaname في الموديل بسبب underscored: true
        type: Sequelize.STRING,
        allowNull: false
      },
      id_willaya: { // تقابل idwillaya في الموديل
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'willayas', // يجب أن يكون اسم جدول الولايات "willayas"
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
    await queryInterface.dropTable('dairas');
  }
};