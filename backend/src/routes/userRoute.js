import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsersProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = new Router();

// User Registration Route
userRouter.post("/register", registerUser);
// User Login Route
userRouter.post("/login", loginUser);
//User Profile
userRouter.get("/profile", authUser, getUserProfile);
//get all users profile
userRouter.get("/all-users", getAllUsersProfile);
//update user profile
userRouter.put(
  "/update-profile",
  authUser,
  upload.single("avatar"),
  updateUserProfile
);

export default userRouter;
