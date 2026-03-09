'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vacance_calendar', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      begin_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      year_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'years', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      trimestre_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'trimestres', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      vacance_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'vacances', key: 'id' },
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
    await queryInterface.dropTable('vacance_calendar');
  }
};