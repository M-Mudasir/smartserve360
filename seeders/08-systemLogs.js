"use strict";

const data = require("./data/systemLogs");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("system_logs", data);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("system_logs", null, {});
  },
};
