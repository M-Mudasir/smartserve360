"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("inventories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      totalQuantity:{
        type: Sequelize.FLOAT,
      },
      quantity: {
        type: Sequelize.FLOAT,
      },
      remainingQuantity: {
        type: Sequelize.FLOAT,
      },
      itemBrand: {
        type: Sequelize.STRING,
      },
      expiryDate: {
        type: Sequelize.DATE,
      },
      inventoryUnit: {
        type: Sequelize.ENUM("kg", "L", "each"),
      },
      inventoryType: {
        type: Sequelize.ENUM("grocery", "article"),
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("inventories");
  },
};
