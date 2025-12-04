import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

//admin login controller

const loginAdminUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials",
    });
  }
  const aToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.status(200).json({
    success: true,
    data: { aToken },
  });
});
export { loginAdminUser };
