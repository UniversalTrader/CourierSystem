import mongoose from "mongoose";

// Counter schema for tracking ID sequence
const counterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 1000, // Initial value 1000 set karte hain
  },
});

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;
