const FollowedUser = require("../models/followUserModel");

const saveFollowUsers = async (req, res) => {
  const { userId, followedUser } = req.body;

  try {
    let followUser = await FollowedUser.findOne({ userId });

    if (!followUser) {
      followUser = new FollowedUser({ userId, followedUser });
    } else {
      followUser.followedUser = followedUser;
    }

    await followUser.save();
    res.json({ message: "Liked posts saved successfully" });
  } catch (error) {
    console.log("Error saving liked posts:", error);
    res.status(500).json({ error: "Error saving liked posts" });
  }
};

const getFollowedUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const followUser = await FollowedUser.findOne({ userId });
    const followedUser = followUser ? followUser.followedUser : [];
    res.json(followedUser);
  } catch (error) {
    console.log("Error fetching liked posts:", error);
    res.status(500).json({ error: "Error fetching liked posts" });
  }
};

// find and return userId for documents where currentId is in the followedUser array
const findDocumentsWithCurrentId = async (req, res) => {
  const { currentId } = req.params;

  try {
    const documents = await FollowedUser.find({ followedUser: currentId });

    if (documents.length > 0) {
      const userIds = documents.map((document) => document.userId);
      res.json({ userIds });
    } else {
      res.json({ userIds: [] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteFollowedUser = async (req, res) => {
  const { userId, idToRemove } = req.params;

  try {
    const document = await FollowedUser.findOne({ userId });
    
    if (!document) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the ID from the followedUser array
    document.followedUser = document.followedUser.filter(
      (userId) => userId.toString() !== idToRemove
    );

    await document.save();

    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  saveFollowUsers,
  getFollowedUser,
  findDocumentsWithCurrentId,
  deleteFollowedUser,
};
