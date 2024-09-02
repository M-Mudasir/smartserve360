"use strict";
/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcryptjs");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      password: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.ENUM("superuser", "staff", "user", "vendor"),
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fullName: {
        type: Sequelize.STRING(100),
      },
      verificationCode: {
        type: Sequelize.STRING(6),
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

      // Check if there are any users
      const existingUsersCount = await queryInterface.sequelize.query("SELECT COUNT(*) FROM users");
      const usersCount = existingUsersCount[0][0]['COUNT(*)'];
      const hashedPassword = await bcrypt.hash("smartserve360admin", 10);
      // If there are no users, create a superuser
      if (usersCount === 0) {
        await queryInterface.bulkInsert('users', [{
          role: "superuser",
          email: "admin@smartserve360.com",
          fullName: "Global Admin",
          password: hashedPassword, 
          createdAt: new Date(),
          updatedAt: new Date(),
        }]);
      }
    },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
