"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Deal extends Model {
    static associate(models) {

    }
  }

  Deal.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
      },
      menuItems: {
        type: DataTypes.JSON,  //[{menuItem:{}, quantity:y}]
      },
      price: {
        type: DataTypes.INTEGER,
      },
      isActive:{
        type:DataTypes.BOOLEAN,
      }
    },
    {
      sequelize,
      modelName: "deals",
      timestamps: true,
    }
  );

  return Deal;
};