const {
  signup,
  signin,
  changePassword,
  checkDuplicateUsernameOrEmail,
} = require("./auth.action.js");

module.exports = {
  "/signup": {
    post: {
      middlewares: checkDuplicateUsernameOrEmail,
      action: signup,
      level: "public",
    },
  },
  "/signin": {
    post: {
      action: signin,
      level: "public",
    },
  },
  "/change-password": {
    post: {
      action: changePassword,
      level: "public",
    },
  },
};
