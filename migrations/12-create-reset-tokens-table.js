// migrations/XXXXXXXXXXXXXX-create-reset-tokens.js
'use strict';
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reset_tokens', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false
      },
      expires_at: { // وقت انتهاء صلاحية الكود
        type: Sequelize.DATE,
        allowNull: false
      },
      user_id: { // ربط الرمز بالمستخدم
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
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
  down: async (queryInterface) => await queryInterface.dropTable('reset_tokens')
};