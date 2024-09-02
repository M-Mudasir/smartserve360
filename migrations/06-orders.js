"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customerName: {
        type: Sequelize.STRING,
      },
      contactInfo:{
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DOUBLE,
      },
      type: {
        type: Sequelize.ENUM("online", "dine-in"), // Adjust ENUM values as needed
      },
      status: {
        type: Sequelize.ENUM("pending", "completed", "cancelled"), // Adjust ENUM values as needed
      },
      menuItems :{
        type: Sequelize.JSON, // JSON data type for menuItems
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
    await queryInterface.dropTable("orders");
  },
};
