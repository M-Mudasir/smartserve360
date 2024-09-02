"use strict";

const data = require("./data/menu-items");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("menu_items", data);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("menu_items", null, {});
  },
};
