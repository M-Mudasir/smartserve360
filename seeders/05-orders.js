"use strict";
const data = require("./data/orders");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add seed data to the "orders" table
    return queryInterface.bulkInsert("orders", data);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded data from the "orders" table
    return queryInterface.bulkDelete("orders", null, {});
  },
};
