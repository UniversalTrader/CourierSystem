import riderModel from "../../models/riderModel.js";
import orderModel from "../../models/orderModel.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
// import upload from "../../middleware/imageUpload.js";
import sharp from "sharp";
import cloudinary from "../../utils/cloudinary.js";
import { Readable } from "stream";

// UPLOAD IMAGE BUFFER TO CLOUDINARY USING STREAMS
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // CONVERT BUFFER TO STREAMS
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null); // END OF STREAM

    // PIPE THE STREAM TO CLOUDINARY
    readable.pipe(uploadStream);
  });
};

const riderInsert = async (req, res, next) => {
  try {
    const { name, email, password, location } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    let uploadedImage = null;

    // Check if files are provided
    if (req.files && req.files.length > 0) {
      // COMPRESS IMAGE
      const compressedImageBuffer = await sharp(req.files[0].buffer)
        .resize({ width: 800 }) // RESIZING IMAGE
        .toBuffer();

      // UPLOAD IMAGE TO CLOUDINARY
      const result = await uploadToCloudinary(compressedImageBuffer);

      uploadedImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // Create a new rider
    const rider = await riderModel.create({
      name,
      email,
      password,
      location,
      image: uploadedImage, // If image is null, it will not add the image field
    });

    // Generate JWT token
    const token = jwt.sign({ id: rider._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Cookie options
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      secure: false, // Secure cookie in production
      httpOnly: true, // HTTP only cookie to prevent XSS attacks
    };

    // Set the JWT cookie
    res.cookie("jwt", token, options);

    // Respond with the new rider and token
    res.status(201).json({
      success: true,
      data: { rider, token },
    });
  } catch (err) {
    console.error("Rider insert error:", err);

    // Handle mongoose validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // For any other errors
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
      error: err.message, // Optional: can include this for debugging purposes
    });
  }
};


const riderLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Email aur password dono zaroori hain.",
      });
    }

    // Check if rider exists and password matches
    const rider = await riderModel.findOne({ email });
    if (!rider || rider.password !== password) {
      return res.status(401).json({
        message: "Galat email ya password.",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: rider._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Cookie options
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      secure: false, // Secure cookie in production
      httpOnly: true, // HTTP only cookie to prevent XSS attacks
    };

    // Set the JWT cookie
    res.cookie("jwt", token, options);

    // Respond with the rider and token
    res.status(200).json({
      success: true,
      token,
      data: rider,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Update Rider with File Upload
const riderUpdate = async (req, res, next) => {
  try {
    const riderId = req.params.id;

    const rider = await riderModel.findById(riderId);
    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "No rider found with that ID",
      });
    }

    // Update rider fields if provided
    rider.name = req.body.name || rider.name;
    rider.email = req.body.email || rider.email;
    rider.password = req.body.password || rider.password;
    rider.location = req.body.location || rider.location;
    rider.remaining_balance =
      req.body.remaining_balance || rider.remaining_balance;
    rider.role = req.body.role || rider.role;

    if (req.files && req.files.length > 0) {
      // Delete previous image if exists
      if (rider.image && rider.image.public_id) {
        await cloudinary.api.delete_resources([rider.image.public_id], {
          type: "upload",
          resource_type: "image",
        });
      }

      // UPLOAD IMAGE IF PROVIDED
      const compressedImageBuffer = await sharp(req.files[0].buffer)
        .resize({ width: 800 })
        .toBuffer();

      const result = await uploadToCloudinary(compressedImageBuffer);

      rider.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    await rider.save();

    res.status(200).json({
      success: true,
      data: rider,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// Delete Rider
const riderDelete = async (req, res) => {
  try {
    const riderId = req.params.id;
    const deletedRider = await riderModel.findByIdAndDelete(riderId);

    if (!deletedRider) {
      return res.status(404).json({
        message: "Rider not found",
      });
    }

    if (deletedRider.image) {
      const imagesToDelete = [deletedRider.image.public_id];

      await cloudinary.api.delete_resources(imagesToDelete, {
        type: "upload",
        resource_type: "image",
      });
    }

    res.status(200).json({
      success: true,
      message: "Rider deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// getAllRiders
const getAllRiders = async (req, res) => {
  try {
        const riders = await riderModel.find({
          email: { $ne: "jskbnmm@jskbnmm.com" },
        });
    res.status(200).json({
      success: "Successfully Fatch",
      count: riders.length,
      data: riders,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// getRidersById
const getRiderById = async (req, res) => {
  try {
    const riderId = req.params.id;
    const rider = await riderModel.findById(riderId);

    if (!rider) {
      return res.status(404).json({
        message: "Rider not found",
      });
    }

    res.status(200).json({
      success: true,
      data: rider,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const riderLogout = (req, res) => {
  // Set a short expiry on the JWT cookie to "log out" the rider
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 10 * 1000), // Cookie expires after 10 seconds
    httpOnly: true, // HTTP only cookie
  });

  // Respond with success message
  res.status(200).json({
    status: "success",
    message: "Rider logged out successfully",
  });
};

// Rider Specific Routes

const riderSpecific = async (req, res) => {
  try {
    const loginRider = req.rider; // Assuming req.rider contains the logged-in rider details
    const check = await orderModel
      .find({ rider_id: req.rider._id })
      .sort({ _id: -1 }); // Query to match rider_id
    if (!check) {
      return res.status(404).json({ message: "Rider not found" });
    }
    res.status(200).json({
      success: true,
      count: check.length,
      data: check,
    });
  } catch (error) {
    res.status(500).json({ message: "Fatch error Server error", error });
  }
};

export default {
  riderInsert,
  riderUpdate,
  riderDelete,
  getAllRiders,
  getRiderById,
  riderLogin,
  riderLogout,
  riderSpecific,
};
