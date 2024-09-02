const {
  checkDuplicateUsernameOrEmail,
  listVendors,
  createVendor,
  getOneVendor,
  updateVendor

} = require("./vendors.action");

const { validateToken } = require("../../middleware/authorize");
module.exports = {
  "/": {
    get: {
      action: [validateToken, listVendors],
      level: "public",
    },
    post: {
      action: [checkDuplicateUsernameOrEmail, validateToken, createVendor],
      level: "public",
    }
  },
  "/:id":{
    get: {
      action: [validateToken, getOneVendor],
      level: "public",
    },
    put: {
      action: [validateToken, updateVendor],
      level: "public",
    }
  }

};
