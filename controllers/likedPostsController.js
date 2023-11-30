const LikedPost = require('../models/likedPostsModel');

const saveLikedPosts = async (req, res) => {
  const { userId, likedPosts } = req.body;

  try {
    let likedPost = await LikedPost.findOne({ userId });

    if (!likedPost) {
      likedPost = new LikedPost({ userId, likedPosts });
    } else {
      likedPost.likedPosts = likedPosts;
    }

    await likedPost.save();
    res.json({ message: 'Liked posts saved successfully' });
  } catch (error) {
    console.log('Error saving liked posts:', error);
    res.status(500).json({ error: 'Error saving liked posts' });
  }
};

const getLikedPosts = async (req, res) => {
  const userId = req.params.userId;

  try {
    const likedPost = await LikedPost.findOne({ userId });
    const likedPosts = likedPost ? likedPost.likedPosts : [];
    res.json(likedPosts);
  } catch (error) {
    console.log('Error fetching liked posts:', error);
    res.status(500).json({ error: 'Error fetching liked posts' });
  }
};

module.exports = {
  saveLikedPosts,
  getLikedPosts,
};
