"use strict";

const data = require("./data/inventories");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add seed data to the "items" table
    return queryInterface.bulkInsert("inventories", data);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded data from the "items" table
    return queryInterface.bulkDelete("inventories", null, {});
  },
};
