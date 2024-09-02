"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
     
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customerName: {
        type: DataTypes.STRING,
      },
      contactInfo:{
        type: DataTypes.STRING
      },
      amount: {
        type: DataTypes.DOUBLE,
      },
      type: {
        type: DataTypes.ENUM("online", "dine-in"), 
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "cancelled"),
      },
      menuItems :{
        type:DataTypes.JSON, //[{menuItem:{}, quantity:y}]
      }
    },
    {
      sequelize,
      modelName: "orders",
      timestamps: true,
    }
  );

  return Order;
};
