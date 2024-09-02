"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MenuItem extends Model {
    static associate(models) {
     
    }
  }

  MenuItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
      },
      servingSize: {
        type: DataTypes.INTEGER,
      },
      category: {
        type: DataTypes.STRING,
      },
      subCategory: {
        type: DataTypes.STRING,
      },
      imgUrl:{
        type:DataTypes.STRING,
      },
      recipe:{
        type:DataTypes.TEXT,
      },
      price:{
        type:DataTypes.FLOAT,
      },
      isActive:{
        type:DataTypes.BOOLEAN,
      },
      ingredient:{
        type:DataTypes.JSON, // [{inventoryId:x, quantity:y}]
      }
    },
    {
      sequelize,
      modelName: "menu_items",
      timestamps: true, 
    }
  );

  return MenuItem;
};
