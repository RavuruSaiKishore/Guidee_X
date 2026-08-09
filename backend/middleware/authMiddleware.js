// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/Student.js"; // Adjust path to your Student/User model

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // format: "Bearer token"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB to check current tokenVersion
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if session has been terminated by a newer login elsewhere
    if (decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        message: "Session expired because you logged in from another device.",
        sessionExpired: true,
      });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized - Invalid token",
    });
  }
};
