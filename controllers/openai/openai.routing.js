const { validateToken } = require("../../middleware/authorize");
const {
    generateInstruction, generateAdminResponse, generateSQLAgent
} = require("./openai.action");
module.exports = {
  "/generate-instruction": {
    post: {
      action: [validateToken, generateInstruction],
      level: "public",
    },
  },
  "/generate-admin-response": {
    post: {
      action: [validateToken, generateAdminResponse],
      level: "public",
    },
  },
  "/generate-sql-agent": {
    post: {
      action: [validateToken, generateSQLAgent],
      level: "public",
    },
  }
}
