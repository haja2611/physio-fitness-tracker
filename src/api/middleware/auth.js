const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Extract the token from the "Bearer" format
    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      throw new Error("Invalid token format");
    }
    const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Access denied. Invalid token." });
  }
}

module.exports = auth;
