const { validateToken } = require("../../middleware/authorize");
const { updateOrder } = require("./order.action");
const {
  listOrders,
  createOrder,
  getOrder,
  deleteOrder,
} = require("./order.action");
module.exports = {
  "/": {
    get: {
      action: [validateToken, listOrders],
      level: "public",
    },
    post: {
      action: [validateToken, createOrder],
      level: "public",
    },
  },
  "/:id": {
    get: {
      action: [validateToken, getOrder],
      level: "public",
    },
    put:{
      action: [validateToken, updateOrder],
      level: "public",
    },
    delete: {
      action: [validateToken, deleteOrder],
      level: "public",
    },
  },
};
