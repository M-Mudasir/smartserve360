const { validateToken } = require("../../middleware/authorize");

const {
  listVendorOrders,
  createVendorOrder,
  getVendorOrder,
  deleteVendorOrder,
  getDispatch,updateDispatch
} = require("./orders.action");
module.exports = {
  "/": {
    get: {
      action: [validateToken, listVendorOrders],
      level: "public",
    },
    post: {
      action: [validateToken, createVendorOrder],
      level: "public",
    },
  },
  "/dispatch": {
    get: {
      action: [validateToken, getDispatch],
      level: "public",
    },
    put: {
      action: [validateToken, updateDispatch],
      level: "public",
    },
  },
  "/:id": {
    get: {
      action: [validateToken, getVendorOrder],
      level: "public",
    },

    delete: {
      action: [validateToken, deleteVendorOrder],
      level: "public",
    },
  },
 
};
