"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    static associate(models) {
      
    }
  }

  Vendor.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name:{
        type: DataTypes.STRING
      },
      order: {
        type: DataTypes.JSON
      },
      email:{
        type:DataTypes.STRING
      },
      contact: {
        type: DataTypes.STRING,
      },
      rating: {
        type: DataTypes.INTEGER,
      },
      paymentMethod: {
        type: DataTypes.STRING,
      },
      paymentTerms: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "vendors",
      timestamps: false, 
    }
  );

  return Vendor;
};
