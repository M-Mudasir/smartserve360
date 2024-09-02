const { validateToken } = require("../../middleware/authorize");

const {
  listInventory,
  createInventory,
  getInventory,
  deleteInventory,
  updateInventory,
} = require("./inventory.action");
module.exports = {
  "/": {
    get: {
      action: [validateToken, listInventory],
      level: "public",
    },
    post: {
      action: [validateToken, createInventory],
      level: "public",
    },
  },
  "/:id": {
    get: {
      action: [validateToken, getInventory],
      level: "public",
    },
    put:{
      action: [validateToken, updateInventory],
      level: "public",
    },
    delete: {
      action: [validateToken, deleteInventory],
      level: "public",
    },
  },
};
