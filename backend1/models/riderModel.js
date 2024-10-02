import mongoose from "mongoose";
const { Schema } = mongoose;

// Rider Schema
const riderSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name cannot be more than 50 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    image: {
      url: {
        type: String,
        required: false, // Now image is not required
      },
      public_id: {
        type: String,
        required: false, // Now image is not required
      },
    },
    remaining_balance: {
      type: Number,
      default: 0,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Rider = mongoose.model("Rider", riderSchema);

export default Rider;
