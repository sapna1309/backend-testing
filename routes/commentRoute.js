const express = require("express");
const router = express.Router();
const {saveComment, getComments,deleteSingleComment} = require("../controllers/commentController");
const {verifyToken} = require("../controllers/authController");

router.post("/save-comments", saveComment);

router.get("/get-comments/:postId", getComments);

router.delete("/remove-comment/:id",verifyToken,deleteSingleComment);

module.exports = router;
