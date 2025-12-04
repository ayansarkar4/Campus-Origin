import { Router } from "express";
import { loginAdminUser } from "../controllers/adminController.js";
const adminRouter = new Router();

//Admin Login Route
adminRouter.post("/login", loginAdminUser);

export default adminRouter;
