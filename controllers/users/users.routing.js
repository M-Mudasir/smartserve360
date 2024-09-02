const {
  createUser,
  listUsers,
  checkDuplicateUsernameOrEmail,
  updateUser,
  getUser,
  deleteUser,
} = require("./users.action");
const { validateToken } = require("../../middleware/authorize");
module.exports = {
  "/": {
    get: {
      action: [validateToken, listUsers],
      level: "public",
    },
    post: {
      action: [checkDuplicateUsernameOrEmail, validateToken, createUser],
      level: "public",
    },
  },
  "/:id": {
    get: {
      action: [validateToken, getUser],
      level: "public",
    },
    put: {
      action: [validateToken, updateUser],
      level: "public",
    },
    delete: {
      action: [validateToken, deleteUser],
      level: "public",
    },
  },
};
