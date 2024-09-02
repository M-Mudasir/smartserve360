"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("vendor_orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      inventoryId: {
        type: Sequelize.INTEGER,
      },
      inventoryName: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING
      },
      dispatchDate: {
        type: Sequelize.DATE,
      },
      expiryDate: {
        type: Sequelize.DATE,
      },
      quantity: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("vendor_orders");
  },
};
