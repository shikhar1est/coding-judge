const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check if Authorization header exists and is properly formatted
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Basic payload sanity check
    if (!decoded.id || !decoded.role) {
      return res.status(403).json({ error: "Token missing required fields (id, role)" });
    }

    // 4. Attach user info to request object for downstream access
    req.user = decoded;

    next(); // Proceed to the next middleware or controller

  } catch (err) {
    // 5. Token verification errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(400).json({ error: "Invalid token" });
    } else {
      console.error("Unexpected token verification error:", err);
      return res.status(500).json({ error: "Token verification failed unexpectedly" });
    }
  }
};

module.exports = verifyToken;
