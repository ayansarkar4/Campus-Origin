import { Router } from "express";
import {
  createComplaint,
  deleteComplaint,
  getAllComplaints,
  updateComplaintPriority,
  updateComplaintStatus,
} from "../controllers/complainBoxController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";
import adminAuth from "../middlewares/adminAuth.js";
const complainRouter = Router();

//create a complaint'
complainRouter.post(
  "/create",
  authUser,
  upload.array("attachments", 5),
  createComplaint
);
//get all complaints route
complainRouter.get("/all", getAllComplaints);
//update complaint status route (admin only)
complainRouter.put("/update-status/:id", adminAuth, updateComplaintStatus);
//update complaint priority route (admin only)
complainRouter.put("/update-priority/:id", adminAuth, updateComplaintPriority);
//delete complaint route (admin only)
complainRouter.delete("/delete/:id", adminAuth, deleteComplaint);

export default complainRouter;
