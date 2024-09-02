"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("vendors", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name:{
        type: Sequelize.STRING,
      },
      order:{
        type: Sequelize.JSON,
      },
      email:{
        type: Sequelize.STRING,
      },
      contact: {
        type: Sequelize.STRING,
      },
      rating: {
        type: Sequelize.INTEGER,
      },
      paymentMethod: {
        type: Sequelize.STRING,
      },
      paymentTerms: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("vendors");
  },
};
