const jwt = require("jsonwebtoken");
require("dotenv").config();
const checkRole = (requiredRole) => (req, res, next) => {
  // console.log("============================ required role =========================================");

  const authToken = req.headers.authorization;
  const cookieToken = req?.cookies?.authorization;


  let token;
  if (authToken) {
    token = authToken;
  } else {
    token = cookieToken;
  }

  try {
    if (!token) {
      return res.status(403).json({ error: { code: "FORBIDDEN_ACCESS", message: "Sorry, you do not have the necessary permissions to perform this action.", details: "Please contact your administrator for assistance.", }, });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log({ decoded });
    // console.log("decoded: ", decoded);

    if (!decoded || !decoded._id || decoded.role !== requiredRole) {
      return res.status(403).json({ error: { code: "FORBIDDEN_ACCESS", message: "Sorry, you do not have the necessary permissions to perform this action.", details: "Please contact your administrator for assistance.", }, });
    }
    req.userId = decoded._id;
    // console.log("req: ", req.userId);

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const isAdmin = checkRole("admin");
const isUser = checkRole("user");
module.exports = { isAdmin, isUser };