"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  Transaction.init(
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
        type: DataTypes.ENUM("credit", "debit"), 
      },
    },
    {
      sequelize,
      modelName: "transactions",
      timestamps: true, // Use timestamps
    }
  );

  return Transaction;
};
