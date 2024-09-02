const { validateToken } = require("../../middleware/authorize");

const {
  listDeals,
  createDeal,
  getDeal,
  deleteDeal,
  updateDeal,
} = require("./deals.action");
module.exports = {
  "/": {
    get: {
      action: [validateToken, listDeals],
      level: "public",
    },
    post: {
      action: [validateToken, createDeal],
      level: "public",
    },
  },
  "/:id": {
    get: {
      action: [validateToken, getDeal],
      level: "public",
    },
    put: {
      action: [validateToken, updateDeal],
      level: "public",
    },
    delete: {
      action: [validateToken, deleteDeal],
      level: "public",
    },
  },
};
