const { validateToken } = require("../../middleware/authorize");
const { listLogs } = require("./systemLogs.action");
module.exports = {
  "/": {
    get: {
      action: [validateToken, listLogs],
      level: "public",
    },
  },
}
