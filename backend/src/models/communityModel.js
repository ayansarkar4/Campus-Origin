import mongoose, { Schema } from "mongoose";

const communitySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  skillTag: {
    type: String,
    required: true,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
});

const Community = new mongoose.model("Community", communitySchema);

export default Community;
