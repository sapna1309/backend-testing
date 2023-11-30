const express = require('express');
const router = express.Router();
const likedPostsController = require('../controllers/likedPostsController');

router.post('/save-liked-posts', likedPostsController.saveLikedPosts);
router.get('/get-liked-posts/:userId', likedPostsController.getLikedPosts);

module.exports = router;

