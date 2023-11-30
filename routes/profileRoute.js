const express = require("express");
const router = express.Router();
const upload = require("./saveToCloud")


const {
  profileUploader,
  getProfileById,
} = require("../controllers/profileController");

router.post("/profile-upload", upload.single("profile"), profileUploader);
router.get("/:id", getProfileById);

module.exports = router;
