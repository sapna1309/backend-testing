const mongoose = require('mongoose');

const followUser = new mongoose.Schema({
  userId: String,
  followedUser: [String],
});

const FollowedUser = mongoose.model('FollowedUser', followUser);

module.exports = FollowedUser
