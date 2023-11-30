const mongoose = require("mongoose");

const chatRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  requestId: {
    type: String,
    unique: true,
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChatRequest", chatRequestSchema);
