import LostAndFound from "../models/lostAndFoundModel";
import asyncHandler from "../utils/asyncHandler";
import { v2 as cloudinary } from "cloudinary";

// Create a lost and found item
const createLostAndFoundItem = asyncHandler(async (req, res) => {
  const { title, description, status, longitude, latitude } = req.body;

  // Validate fields
  if (!title || !description || !status) {
    return res.json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  if (!longitude || !latitude) {
    return res.json({
      success: false,
      message: "Please provide valid location coordinates",
    });
  }

  let photoUrl = null;

  // If an image file exists, upload to Cloudinary first
  if (req.file) {
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
    });
    photoUrl = uploadedImage.secure_url;
  }

  // Create new lost & found item
  const newItem = await LostAndFound.create({
    title,
    description,
    status,
    photoUrl,
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    reporter: req.user.id,
  });

  res.status(201).json({
    message: "Lost & Found item created successfully",
    data: newItem,
  });
});
