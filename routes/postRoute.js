const express = require("express");
const upload = require("./saveToCloud")
const router = express.Router();
const {createPost, getAllPosts, getSinglePosts,deleteSinglePost} = require("../controllers/postController");
const {verifyToken} = require("../controllers/authController");

router.get("/get-posts", verifyToken, getAllPosts);
router.get("/get-posts/:id", getSinglePosts);
router.post("/create-post", upload.single("image"), verifyToken, createPost);
router.delete("/remove-post/:id",verifyToken,deleteSinglePost);
module.exports = router;
