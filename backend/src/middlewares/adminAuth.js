import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const aToken = req.headers.atoken || req.headers.aToken;
    if (!aToken) {
      return res.status(401).json({
        success: false,
        message: "No admin token provided",
      });
    }
    const decoded_token = jwt.verify(aToken, process.env.JWT_SECRET);
    if (decoded_token.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin token",
      });
    }
    next();
  } catch (error) {
    console.log("Error in authAdmin middleware", error);
    res.json({ success: false, message: error.message });
  }
};
export default adminAuth;
