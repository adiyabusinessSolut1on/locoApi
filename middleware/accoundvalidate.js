const jwt = require("jsonwebtoken");
require("dotenv").config();

const accountMiddleware = (req, resp, next) => {
  const token = req.headers.authorization;
  try {
    if (token) {
      const { _id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (_id) {
        req.userId = _id;
        next();
      }
    } else {
      resp
        .status(401)
        .json({ success: false, message: "token expired, access denied" });
    }
  } catch (err) {
    resp.json({ success: false, message: err });
  }
};

module.exports = accountMiddleware;
