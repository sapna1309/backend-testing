const mongoose = require('mongoose');

const likedPostSchema = new mongoose.Schema({
  userId: String,
  likedPosts: [String],
});

const LikedPost = mongoose.model('LikedPost', likedPostSchema);

module.exports = LikedPost
