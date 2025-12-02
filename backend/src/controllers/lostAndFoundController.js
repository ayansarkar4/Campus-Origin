import LostAndFound from "../models/lostAndFoundModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";

// Create a lost and found item
const createLostAndFoundItem = asyncHandler(async (req, res) => {
  const { title, description, status, longitude, latitude } = req.body;

  // Validate required fields
  if (!title || !description || !status) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields",
    });
  }

  if (!longitude || !latitude) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid location coordinates",
    });
  }

  let photoUrls = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: "image",
      });

      photoUrls.push(uploadResult.secure_url);
    }
  }

  // Save to DB
  const newItem = await LostAndFound.create({
    title,
    description,
    status,
    photoUrl: photoUrls, // array of URLs (0–5 photos)
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    reporter: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Lost & Found item created successfully",
    data: newItem,
  });
});

//get all lost and found items controller
const getAllLostAndFoundItems = asyncHandler(async (req, res) => {
  const items = await LostAndFound.find()
    .populate("reporter", "fullName email")
    .populate("finder", "fullName email");
  res.status(200).json({
    success: true,
    message: "Lost & Found items fetched successfully",
    data: items,
  });
});

//get single lost and found item controller
const getLostAndFoundItemById = asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  const item = await LostAndFound.findById(itemId)
    .populate("reporter", "fullName email")
    .populate("finder", "fullName email");
  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Lost & Found item not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Lost & Found item fetched successfully",
    data: item,
  });
});

// update lost and found item controller
const updateLostAndFoundItem = asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  const item = await LostAndFound.findById(itemId);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Lost & Found item not found",
    });
  }

  // Only reporter or admin can update
  if (item.reporter.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to update this item",
    });
  }

  const { title, description, status, longitude, latitude } = req.body;

  let updatedPhotos = item.photoUrl; // keep old photos by default

  // If new files are uploaded → replace old photos
  if (req.files && req.files.length > 0) {
    updatedPhotos = [];

    for (const file of req.files) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: "image",
      });

      updatedPhotos.push(uploadResult.secure_url);
    }
  }

  // Build updated fields
  const updatedData = {
    title,
    description,
    status,
    photoUrl: updatedPhotos,
  };

  // Update location only if both values are present
  if (longitude && latitude) {
    updatedData.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
  }

  const updatedItem = await LostAndFound.findByIdAndUpdate(
    itemId,
    updatedData,
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Lost & Found item updated successfully",
    data: updatedItem,
  });
});

//delete lost and found item controller
const deleteLostAndFoundItem = asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  const item = await LostAndFound.findById(itemId);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Lost & Found item not found",
    });
  }
  //only reporter or admin can delete
  if (item.reporter.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to delete this item",
    });
  }
  await LostAndFound.findByIdAndDelete(itemId);
  res.status(200).json({
    success: true,
    message: "Lost & Found item deleted successfully",
  });
});
//claim lost and found item controller
const claimLostAndFoundItem = asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  const item = await LostAndFound.findById(itemId);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Lost & Found item not found",
    });
  }
  // Check if already claimed
  if (item.isClaimed) {
    return res.status(400).json({
      success: false,
      message: "This item has already been claimed",
    });
  }
  if (item.status !== "lost") {
    return res.status(400).json({
      message: "Only lost items can be claimed",
    });
  }
  item.isClaimed = true;
  item.finder = req.user.id;
  await item.save();
  res.status(200).json({
    success: true,
    message: "Lost item claimed successfully",
    data: item,
  });
});
export {
  createLostAndFoundItem,
  getAllLostAndFoundItems,
  getLostAndFoundItemById,
  updateLostAndFoundItem,
  deleteLostAndFoundItem,
  claimLostAndFoundItem,
};
