const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/users/UserModel");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("You are not authorized to access this resource. Please log in to continue.");
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(verified.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("The requested user does not exist. Please check the user ID.");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("You are not authorized to access this resource. Please log in to continue.");
  }
});

const author = asyncHandler(async (req, res, next) => {
  if (req.user.role === "author") {
    next();
  } else {
    res.status(401);
    throw new Error("You must be an author to access this resource.");
  }
});

const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("You must be an admin to access this resource. Please log in with admin credentials.");
  }
});

const verified = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    res.status(401);
    throw new Error("You must be verified to access this resource. Please log in with verified credentials.");
  }
});

const authorAndAuthor = asyncHandler(async (req, res, next) => {
  if (req.user.role === "author" || req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("You must be an author or admin to access this resource. Please log in with the appropriate credentials.");
  }
});
module.exports = { protect, admin, author, verified };
