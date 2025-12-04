import asyncHandler from "../utils/asyncHandler.js";
import ComplainBox from "../models/complainBoxModel.js";
import { v2 as cloudinary } from "cloudinary";

// Create a new complaint
const createComplaint = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required",
    });
  }
  let attachments = [];

  if (req.files && req.files.length > 0) {
    for (let file of req.files) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
      });
      attachments.push({
        url: uploaded.secure_url,
        fileType: file.mimetype,
      });
    }
  }
  const complain = await ComplainBox.create({
    studentName: req.user.id,
    title,
    description,
    category,
    attachments,
  });
  res.status(201).json({
    success: true,
    message: "Complain Created Successfully",
    data: complain,
  });
});

//get all complaints controller

const getAllComplaints = asyncHandler(async (req, res) => {
  const complaints = await ComplainBox.find()
    .populate("studentName", "fullName email")
    .sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: "All Complaints Fetched Successfully",
    data: complaints,
  });
});

//update complaint status controller (admin only)

const updateComplaintStatus = asyncHandler(async (req, res) => {
  const complaintId = req.params.id;

  const { status } = req.body;
  const complain = await ComplainBox.findById(complaintId);
  if (!complain) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    });
  }
  complain.status = status || complain.status;
  await complain.save();
  res.status(200).json({
    success: true,
    message: "Complaint status updated successfully",
    data: complain,
  });
});

//update complaint priority controller (admin only)
const updateComplaintPriority = asyncHandler(async (req, res) => {
  const complaintId = req.params.id;
  const { priority } = req.body;
  const complain = await ComplainBox.findById(complaintId);
  if (!complain) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    });
  }
  complain.priority = priority || complain.priority;
  await complain.save();
  res.status(200).json({
    success: true,
    message: "Complaint priority updated successfully",
    data: complain,
  });
});

//delete complaint controller (admin only)
const deleteComplaint = asyncHandler(async (req, res) => {
  const complaintId = req.params.id;
  const complain = await ComplainBox.findById(complaintId);
  if (!complain) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    });
  }
  await complain.deleteOne();
  res.status(200).json({
    success: true,
    message: "Complaint deleted successfully",
  });
});

export {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
  updateComplaintPriority,
  deleteComplaint,
};
