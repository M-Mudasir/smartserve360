const { validateToken } = require("../../middleware/authorize");

const {
  listNotifications,
  readNotification
} = require("./notification.action");

module.exports = {
  "/": {
    get: {
      action: [validateToken, listNotifications],
      level: "public",
    }
  },
  "/:id": {
    put : {
      action: [validateToken, readNotification],
      level: "public",
    }
  },
};
