import { Router } from "express";
import {
  createCommunity,
  deleteCommunity,
  getAllCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
} from "../controllers/communityController.js";

import adminAuth from "../middlewares/adminAuth.js";
import upload from "../middlewares/multer.js";
import authUser from "../middlewares/authUser.js";
const communityRouter = Router();

//create a community
communityRouter.post(
  "/create",
  adminAuth,
  upload.single("profileImage"),
  createCommunity
);
//get all communities
communityRouter.get("/all", getAllCommunities);
//get single community by id
communityRouter.get("/:id", getCommunityById);
//join a community
communityRouter.post("/:id/join", authUser, joinCommunity);
//leave a community
communityRouter.post("/:id/leave", authUser, leaveCommunity);
//delete a community (admin only)
communityRouter.delete("/:id/delete", adminAuth, deleteCommunity);

export default communityRouter;
