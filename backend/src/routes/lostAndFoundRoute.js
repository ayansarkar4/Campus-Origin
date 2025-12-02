import { Router } from "express";
import {
  claimLostAndFoundItem,
  createLostAndFoundItem,
  deleteLostAndFoundItem,
  getAllLostAndFoundItems,
  getLostAndFoundItemById,
  updateLostAndFoundItem,
} from "../controllers/lostAndFoundController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const lostAndFoundRouter = new Router();
//create lost and found item route
lostAndFoundRouter.post(
  "/create",
  authUser,
  upload.array("photoUrl", 5),
  createLostAndFoundItem
);
//get all lost and found items route
lostAndFoundRouter.get("/all", getAllLostAndFoundItems);
//get single lost and found item route
lostAndFoundRouter.get("/:id", getLostAndFoundItemById);
//update lost and found item route
lostAndFoundRouter.put(
  "/update/:id",
  authUser,
  upload.array("photoUrl", 5),
  updateLostAndFoundItem
);
//delete lost and found item route
lostAndFoundRouter.delete("/delete/:id", authUser, deleteLostAndFoundItem);
//claim lost and found item route
lostAndFoundRouter.post("/claim/:id", authUser, claimLostAndFoundItem);

export default lostAndFoundRouter;
