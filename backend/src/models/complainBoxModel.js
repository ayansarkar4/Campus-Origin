import mongoose, { Schema } from "mongoose";

const complainBoxSchema = new Schema({
  studentName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "academic",
      "hostel",
      "ragging",
      "teacher_issue",
      "administration",
      "technical",
      "library",
      "fees",
      "transport",
      "other",
    ],
    default: "other",
  },
  status: {
    type: String,
    enum: ["pending", "in_review", "resolved", "rejected"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "low",
  },
  attachments: [
    {
      url: String,
      fileType: String,
    },
  ],
});

const ComplainBox = new mongoose.model("ComplainBox", complainBoxSchema);

export default ComplainBox;
