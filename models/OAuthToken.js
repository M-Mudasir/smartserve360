"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OAuthToken extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  OAuthToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      scopes: {
        type: DataTypes.JSON,
      },
      revokedAt: {
        type: DataTypes.DATE,
      },
      expiresAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "oauth_tokens",
      timestamps: true, // Use timestamps
    }
  );

  return OAuthToken;
};
