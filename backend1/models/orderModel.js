import mongoose from "mongoose";
import Counter from "./counterModel.js"; // Counter model ko import karte hain

// Tracking ID generate karne ke liye helper function jo sequence maintain karta hai
const getNextSequence = async function () {
  const counter = await Counter.findOneAndUpdate(
    { id: "orderId" }, // id se sequence track karte hain (har entity ke liye unique hona chahiye)
    { $inc: { seq: 1 } }, // seq ko 1 se increment karte hain
    { new: true, upsert: true } // Agar counter nahi hai to create karta hai
  );
  return counter.seq; // Sequence ko return karte hain
};

const orderSchema = new mongoose.Schema(
  {
    cust_name: {
      type: String,
      required: [true, "Customer name is required."],
    },
    cust_city: {
      type: String,
      required: [true, "Customer city is required."],
    },
    cust_address: {
      type: String,
      required: [true, "Customer address is required."],
    },
    cust_town: {
      // Town field added here
      type: String,
      // required: [true, "Customer town is required."], // Required town field
    },
    cust_number: {
      type: String,
      required: [true, "Customer contact number is required."],
      match: [
        /^\+92\d{10}$/,
        "Please enter a valid phone number (e.g. +921234567890).",
      ],
    },

    tracking_id: {
      type: Number,
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, "Order amount is required."],
      min: [0, "Amount must be a positive number."],
    },
    feedback: {
      type: String,
      default: null, // Feedback will be null by default
    },
    status: {
      type: String,
      enum: [
        "pending",
        "inprocess",
        "return",
        "delivered",
        "hold",
        "canceled",
        "complete",
      ],
      default: "pending", // Default status will be 'pending'
    },
    rider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rider", // Refers to the Rider model for rider_id
      default: "66f78be4ce7159e6fd74c489",
    },
    delivery_charges: {
      type: Number,
      default: 350,
    },
    // ==================== AB DATE DD/MM/YYYY FORMAT MEIN JAYEGI ==================================
    cutsomDate: {
      type: String,
      default: function () {
        return new Date().toLocaleDateString("en-PK");
      },
      required: true,
    },
    // ==================== AB DATE DD/MM/YYYY FORMAT MEIN JAYEGI ==================================
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Pre-save middleware for auto-generating tracking_id
orderSchema.pre("save", async function (next) {
  if (!this.tracking_id) {
    try {
      this.tracking_id = await getNextSequence(); // Sequence se next tracking_id set karte hain
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
