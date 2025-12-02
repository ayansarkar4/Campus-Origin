import mongoose, { Schema } from "mongoose";

const lostAndFoundSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["lost", "found"],
    required: true,
  },
  photoUrl: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isClaimed: {
    type: Boolean,
    default: false,
  },
  finder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

const LostAndFound = new mongoose.model("LostAndFound", lostAndFoundSchema);

export default LostAndFound;
