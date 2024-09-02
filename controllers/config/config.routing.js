const { getConfig } = require("./config.action");
module.exports = {
  "/": {
    get: {
      action: [ getConfig],
      level: "public",
    },
  },};
