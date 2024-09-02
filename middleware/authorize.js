const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
// Middleware for token validation
const validateToken = (req, res, next) => {
  // Get the token from the request headers, query parameters, or cookies
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    // Extract the token and remove the "Bearer " prefix
    const token = authorizationHeader.replace(/^Bearer\s+/i, "");

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Token missing" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      // console.log(token, err, decoded);
      if (err) {
        return res.status(401).json({ error: "Unauthorized - Invalid token" });
      }
      // Attach the decoded token to the request for later use
      req.user = decoded;
      next();
    });
  }
};

// Middleware for authorization
const authorize = (req, res, next) => {
  // Check the user's role or any other authorization criteria
  if (req.user) {
    // Authorize Admin
    next();
  } else {
    return res
      .status(403)
      .json({ error: "Forbidden - Insufficient permissions" });
  }
};

module.exports = {
  validateToken,
  authorize,
};
