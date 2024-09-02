'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('automations', 'createdAt');
    await queryInterface.removeColumn('automations', 'updatedAt');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('automations', 'createdAt', {
      allowNull: true,
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn('automations', 'updatedAt', {
      allowNull: true,
      type: Sequelize.DATE,
    });
  },
};
