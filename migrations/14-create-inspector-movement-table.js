'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('InspectorMovements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // تأكد من مطابقة اسم جدول المستخدمين في قاعدة البيانات
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      idsecteur: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Secteurs', // تأكد من مطابقة اسم جدول المقاطعات
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      year_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Years', // تأكد من مطابقة اسم جدول السنوات
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // نمنع حذف السنة إذا كان لها سجلات حركة
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      note: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // إضافة كشافات (Indexes) لتسريع عمليات البحث
    await queryInterface.addIndex('InspectorMovements', ['user_id']);
    await queryInterface.addIndex('InspectorMovements', ['idsecteur']);
    await queryInterface.addIndex('InspectorMovements', ['year_id', 'is_active']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('InspectorMovements');
  }
};