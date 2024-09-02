"use strict";

const data = require("./data/deals");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("deals", data);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("deals", null, {});
  },
};
