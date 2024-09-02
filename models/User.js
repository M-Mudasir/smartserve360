"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
    }
  }

  Users.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      password: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.ENUM("superuser", "staff", "user"),
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING(100),
      },
      verificationCode: {
        type: DataTypes.STRING(6),
      },
    },
    {
      sequelize,
      modelName: "users",
      timestamps: true,
    }
  );

  return Users;
};
