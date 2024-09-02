"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Automation extends Model {
    static associate(models) {
    
    }
  }

  Automation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      inventoryId:{
        type: DataTypes.INTEGER,
      },
      automated_quantity: {
        type: DataTypes.INTEGER,
      },
      interval: {
        type: DataTypes.INTEGER,
      },
      expiryInDays: {
        type: DataTypes.INTEGER,
      }
    },
    {
      sequelize,
      modelName: "automations",
      timestamps: false, 
    }
  );

  return Automation;
};
