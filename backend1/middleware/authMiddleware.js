import jwt from "jsonwebtoken";
import riderModel from "../models/riderModel.js";

// Protect Route
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      return res.status(401).json({
        message: "Login to get access.",
      });
    }

    if (token === "logout") {
      return res.status(401).json({
        message: "Login to get access.",
      });
    }

    // Token verify karein
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const rider = await riderModel.findById(decoded.id);

    if (!rider) {
      return res.status(404).json({
        message: "Rider not found",
      });
    }

    req.rider = rider; // Rider object ko request me attach karein
    next();
  } catch (err) {
    res.status(500).json({
      message: "Server Error Protect",
      error: err.message,
    });
  }
};

// Role Authorization Middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.rider.role)) {
      return res.status(403).json({
        message: "Aapko is resource ka access nahi hai.",
      });
    }
    next();
  };
};
