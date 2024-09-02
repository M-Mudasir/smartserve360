const fs = require('fs');
const path = require('path');
require("dotenv").config();

module.exports = {
  "development": {
    "username": "root",
    "password": "root",
    "database": "smartserve360",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "port": 3306,
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB,
    "host": process.env.DB_HOST,
    "dialect": "mysql",
    "port": 3306,
  },
};