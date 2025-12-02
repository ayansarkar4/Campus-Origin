import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      res.status(401);
      throw new Error("No token provided, authorization denied");
    }
    const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!token_decoded) {
      res.status(401);
      throw new Error("Token is not valid");
    }
    req.user = { id: token_decoded.userId };
    next();
  } catch (error) {
    console.log("Error in authUser middleware", error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
