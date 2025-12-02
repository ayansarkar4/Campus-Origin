import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

//user register controller

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, department, batch } = req.body;

  let existedUser = await User.findOne({ email });
  if (existedUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists with this email",
    });
  }
  if (!fullName || !email || !password || !department || !batch) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }
  if (!email.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email",
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }
  const user = await User.create({
    fullName,
    email,
    password,
    department,
    batch,
  });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.status(201).json({
    success: true,
    data: { token },
  });
});

//user login controller

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }
  if (!email.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email",
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  const passwordMatch = await user.isPasswordCorrect(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.status(200).json({
    success: true,
    data: { token, user },
  });
});

//get single user profile

const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userData = await User.findById(userId).select("-password");
  res.status(200).json({
    success: true,
    userData,
  });
});

//get all users profile

const getAllUsersProfile = asyncHandler(async (req, res) => {
  const usersData = await User.find().select("-password");
  res.status(200).json({
    success: true,
    usersData,
  });
});

//update user profile

const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { fullName, department, batch, password, skills, bio } = req.body;
  const imageFile = req.file;

  //existing user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  if (fullName) user.fullName = fullName;
  if (password) user.password = password;
  if (department) user.department = department;
  if (batch) user.batch = batch;
  if (skills) user.skills = skills;
  if (bio) user.bio = bio;
  //if avatar image provided
  if (imageFile) {
    const upload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    user.avatar = upload.secure_url;
  }
  await user.save();
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
  });
});

export {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsersProfile,
  updateUserProfile,
};
