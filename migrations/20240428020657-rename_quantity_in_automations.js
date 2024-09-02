'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('automations', 'quantity', 'automated_quantity');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('automations', 'automated_quantity', 'quantity');
  }
};
