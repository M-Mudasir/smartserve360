const { validateToken } = require("../../middleware/authorize");

const {
  listPurchaseOrders,
  createPurchaseOrder,
  getPurchaseOrder,
  deletePurchaseOrder,
} = require("./purchaseOrders.action");
module.exports = {
  "/": {
    get: {
      action: [validateToken, listPurchaseOrders],
      level: "public",
    },
    post: {
      action: [validateToken, createPurchaseOrder],
      level: "public",
    },
  },
  "/:id": {
    get: {
      action: [validateToken, getPurchaseOrder],
      level: "public",
    },

    delete: {
      action: [validateToken, deletePurchaseOrder],
      level: "public",
    },
  },
};
