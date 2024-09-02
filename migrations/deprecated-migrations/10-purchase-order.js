"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("purchase_orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      inventoryId: {
        type: Sequelize.INTEGER,
      },
      procurementRequisitionId: {
        type: Sequelize.INTEGER,
      },
      vendorId: {
        type: Sequelize.INTEGER,
      },
      quantityRequested: {
        type: Sequelize.INTEGER,
      },
      quantityAllocated: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      amount: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.JSON,
      },
      inventoryName: {
        type: Sequelize.STRING,
      },
      inventoryUnit: {
        type: Sequelize.STRING,
      },
      inventoryType: {
        type: Sequelize.INTEGER,
      },
      vendorName: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("purchase_orders");
  },
};
