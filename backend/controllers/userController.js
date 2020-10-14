// asyncHandler is used to wrap async functions to catch errors instead of writing multiple try catch statements
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

import generateToken from "../utils/generateToken.js";

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  PUBLIC
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  // Uses the matchPassword method created in the model to match the hashed password with bcrypt
  if (user && (await user.matchPassword(password))) {
    // If email and passwords match return user JSON data
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // Generate a JWT token with validated user id
      token: generateToken(user._id),
    });
  } else {
    // Unauthorized access
    res.status(401);
    throw new Error("Invalid email or password.");
  }
});

// @desc    Register new user
// @route   POST /api/users
// @access  PUBLIC
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Find user by email
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists.");
  }

  // Create user
  const user = await User.create({ name, email, password });

  if (user) {
    res
      // Successfully created
      .status(201)
      .json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
  } else {
    res.status(400);
    throw new Error("Invalid user data.");
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  PRIVATE
const getUserProfile = asyncHandler(async (req, res) => {
  // Get current logged in user
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

export { authUser, getUserProfile, registerUser };
