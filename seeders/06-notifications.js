"use strict";
const data = require("./data/notifications");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add seed data to the "notifications" table
    return queryInterface.bulkInsert("notifications", data);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded data from the "notifications" table
    return queryInterface.bulkDelete("notifications", null, {});
  },
};
