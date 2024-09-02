"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SystemLog extends Model {
    static associate(models) {
    }
  }

  SystemLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.ENUM("info", "warning", "error"),
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
    },
    {
      sequelize,
      modelName: "system_logs",
      timestamps: false,
    }
  );

  return SystemLog;
};
