import asyncHandler from "../utils/asyncHandler.js";
import Community from "../models/communityModel.js";
import { v2 as cloudinary } from "cloudinary";

// Create a new community(only admin)
const createCommunity = asyncHandler(async (req, res) => {
  const { name, description, skillTag } = req.body;
  if (!name || !description || !skillTag) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields",
    });
  }
  //upload profile image to cloudinary if exists
  let profileImage = null;
  if (req.file) {
    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
    });
    profileImage = uploaded.secure_url;
  }
  const exists = await Community.findOne({ name });
  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Community with this name already exists",
    });
  }
  const community = await Community.create({
    name,
    description,
    skillTag,
    profileImage,
  });
  res.status(201).json({
    success: true,
    message: "Community created successfully",
    data: { community },
  });
});

//get all communities controller
const getAllCommunities = asyncHandler(async (req, res) => {
  const communities = await Community.find().sort({ name: 1 });
  res.status(200).json({
    success: true,
    data: communities,
  });
});

//get single community + members controller
const getCommunityById = asyncHandler(async (req, res) => {
  const communityId = req.params.id;
  const community = await Community.findById(communityId).populate(
    "members",
    "fullName email avatar"
  );
  if (!community) {
    return res.status(404).json({
      success: false,
      message: "No community found with this id",
    });
  }
  const memberCount = community.members.length;
  res.status(200).json({
    success: true,
    data: { community, memberCount },
  });
});

//join a community controller
const joinCommunity = asyncHandler(async (req, res) => {
  const communityId = req.params.id;
  const userId = req.user.id;
  const community = await Community.findById(communityId);
  if (!community) {
    return res.status(404).json({
      success: false,
      message: "No community found with this id",
    });
  }
  if (community.members.includes(userId)) {
    return res.status(400).json({
      success: false,
      message: "You are already a member of this community",
    });
  }
  community.members.push(userId);
  await community.save();
  res.status(200).json({
    success: true,
    message: "Joined the community successfully",
  });
});

//leave a community controller
const leaveCommunity = asyncHandler(async (req, res) => {
  const communityId = req.params.id;
  const userId = req.user.id;
  const community = await Community.findById(communityId);
  if (!community) {
    return res.status(404).json({
      success: false,
      message: "No community found with this id",
    });
  }
  if (!community.members.includes(userId)) {
    return res.status(400).json({
      success: false,
      message: "You are not a member of this community",
    });
  }
  community.members = community.members.filter(
    (member) => member.toString() !== userId
  );
  await community.save();
  res.status(200).json({
    success: true,
    message: "Left the community successfully",
  });
});

//delete a community controller (only admin)
const deleteCommunity = asyncHandler(async (req, res) => {
  const communityId = req.params.id;
  const community = await Community.findById(communityId);
  if (!community) {
    return res.status(404).json({
      success: false,
      message: "No community found with this id",
    });
  }
  await Community.findByIdAndDelete(communityId);
  res.status(200).json({
    success: true,
    message: "Community deleted successfully",
  });
});
export {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
  deleteCommunity,
};
