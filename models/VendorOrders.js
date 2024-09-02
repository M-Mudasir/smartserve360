"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VendorOrder extends Model {
    static associate(models) {
      
    }
  }

  VendorOrder.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      inventoryId: {
        type: DataTypes.INTEGER,
      },
      inventoryTitle: {
        type: DataTypes.STRING,
      },
      dispatchDate: {
        type: DataTypes.DATE,
      },
      expiryDate: {
        type: DataTypes.DATE,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: "vendor_orders",
      timestamps: true,
    }
  );

  return VendorOrder;
};
