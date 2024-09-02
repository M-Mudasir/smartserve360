const { validateToken } = require("../../middleware/authorize");
const {
  getMenuItem,
  deleteMenuItem,
  createMenuItem,
  listMenuItem,
  updateMenuItem,
} = require("./menu.action");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = {
  "/": {
    get: {
      action: [validateToken ,listMenuItem],
      level: "public",
    },
    post: {
      action: [validateToken, upload.single('image'),createMenuItem],
      level: "public",
    },
  },
  "/:id": {
    get: {
      action: [ validateToken, getMenuItem],
      level: "public",
    },
    put: {
      action: [validateToken,upload.single('image'), updateMenuItem],
      level: "public",
    },
    delete: {
      action: [validateToken, deleteMenuItem],
      level: "public",
    },
  },
};
