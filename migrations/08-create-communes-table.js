// migrations/XXXXXXXXXXXXXX-create-communes.js
'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('communes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      commune_name: { // لاحظ استخدام _ بسبب underscored: true
        type: Sequelize.STRING,
        allowNull: false
      },
      id_daira: { // الربط مع جدول الدوائر
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'dairas', // اسم الجدول في قاعدة البيانات
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
    await queryInterface.dropTable('communes');
  }
};