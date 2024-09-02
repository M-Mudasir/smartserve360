"use strict";
const bcrypt = require("bcryptjs");
const data = require("./data/users");

const saltRounds = 10;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersWithHashedPasswords = await Promise.all(
      data.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        return { ...user, password: hashedPassword };
      })
    );

    return queryInterface.bulkInsert("users", usersWithHashedPasswords,{
      updateOnDuplicate: ["role", "email", "fullName", "password", "updatedAt"],
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
