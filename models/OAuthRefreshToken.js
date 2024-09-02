"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OAuthRefreshToken extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  OAuthRefreshToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      accessTokenId: {
        type: DataTypes.INTEGER,
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
      modelName: "oauth_refresh_tokens",
      timestamps: true, // Use timestamps
    }
  );

  return OAuthRefreshToken;
};
