// asyncHandler is used to wrap async functions to catch errors instead of writing multiple try catch statements
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

import generateToken from "../utils/generateToken.js";

// @desc    Auth user & get token
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

export { authUser };