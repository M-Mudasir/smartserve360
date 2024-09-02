"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PurchaseOrder extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  PurchaseOrder.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      inventoryId: {
        type: DataTypes.INTEGER,
      },
      vendorId: {
        type: DataTypes.INTEGER,
      },
      quantityRequested: {
        type: DataTypes.INTEGER,
      },
      quantityAllocated: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      amount: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.JSON,
      },
      inventoryName: {
        type: DataTypes.STRING,
      },
      inventoryUnit: {
        type: DataTypes.ENUM("kg", "litre", "each"),
      },
      inventoryType: {
        type: DataTypes.ENUM("grocery", "article"),
      },
      vendorName: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "purchase_orders",
      timestamps: true,
    }
  );

  return PurchaseOrder;
};
