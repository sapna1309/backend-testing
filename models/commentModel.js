const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: { type: String },
  commentAuthor: { type: mongoose.Schema.Types.ObjectId },
  createdAt: { type: Date, default: Date.now },
  profileUrl: String,
  name: String,
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
