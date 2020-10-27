import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    // Check if request authorization header has the Bearer token
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Assign token
      token = req.headers.authorization.split(" ")[1];

      // Decode token with secret key
      // Returns { id: 'users id', ... }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user with the decoded user id
      // Omits password
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (e) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }
});

// Admin auth
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an Admin");
  }
};

export { protect, admin };
