const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ success: false, message: "Access Denied" }); // no token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  }
   catch (err) {
    res.status(400).json({ success: false, message: "Invalid Token" });
  }
};

module.exports = authMiddleware;
