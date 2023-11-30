const mongoose = require("mongoose");

const documentSchema = mongoose.Schema(
  {
    "userId": { type: mongoose.Schema.ObjectId, ref: "User" },
    "documentUrl": String,
    "approved": { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const DocumentModel = mongoose.model("document", documentSchema);

module.exports = { DocumentModel };
