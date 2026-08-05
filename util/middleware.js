const jwt = require("jsonwebtoken");

const { SECRET } = require("./config");
const User = require("../models/user");

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({
      error: error.errors.map((e) => e.message),
    });
  } else if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      error: error.errors.map((e) => e.message),
    });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "token invalid" });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "token expired" });
  }

  return res.status(500).json({ error: "internal server error" });
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: "token missing" });
  }

  try {
    const decodedToken = jwt.verify(req.token, SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: "token invalid" });
    }

    const user = await User.findByPk(decodedToken.id);
    if (!user) {
      return res.status(401).json({ error: "token invalid" });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor,
};
