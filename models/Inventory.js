"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  Item.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
      },
      totalQuantity:{
        type: DataTypes.FLOAT,
      },
      quantity: {
        type: DataTypes.FLOAT,
      },
      remainingQuantity:{
        type: DataTypes.FLOAT
      },
      itemBrand: {
        type: DataTypes.STRING,
      },
      expiryDate: {
        type: DataTypes.DATE,
      },
      inventoryUnit:{
        type:DataTypes.ENUM("kg", "L", "each"),
      },
      inventoryType:{
        type:DataTypes.ENUM("grocery", "article"),
      },
      automation:{
        type:DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "inventories",
      timestamps: true, 
    }
  );

  return Item;
};
