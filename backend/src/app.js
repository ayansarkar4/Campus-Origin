import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); //for static files
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Api is running");
});

import userRouter from "./routes/userRoute.js";
import lostAndFoundRouter from "./routes/lostAndFoundRoute.js";
import complainBoxRouter from "./routes/complainBoxRoute.js";
import adminRouter from "./routes/adminRoute.js";
import communityRouter from "./routes/communityRoute.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/lost-and-found", lostAndFoundRouter);
app.use("/api/v1/complain-box", complainBoxRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/community", communityRouter);

export default app;
