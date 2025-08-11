import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, avatar, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    avatar,
    role,
  });

  if (user) {
    await user.save();
    res.status(200).json({ message: "User registered.", success:true });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log(user);
  
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  console.log(user);
  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    const token = await generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
