const { ProfileModel } = require("../models/profileModel");
const cloudinary = require("../config/cloudinary");
require("dotenv").config();


const profileUploader = async (req, res) => {
  await cloudinary.uploader.upload(req.file.path, async (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Error uploading profile");
    }
    const filter = { userId: req.body.userId };
    const update = { profileUrl: result.url };

    // Try to find the user and update their profileUrl
    const existUser = await ProfileModel.findOneAndUpdate(filter, update, {
      new: true, // Return the updated document
      upsert: true, // Create a new document if it doesn't exist
    });

    if (!existUser) {
      res.send("User not found");
    } else {
      res.send("Updated");
    }
  });
};

const getProfileById = async (req, res) => {
  try {
    let existUser = await ProfileModel.findOne({ userId: req.params.id });
    if (existUser) {
      res.status(200).send({profileUrl: existUser.profileUrl});
    } else {
      res.send({ error: "User not found" });
    }
  } catch (error) {
    console.error(`Error while getting image of userID${req.params.id}`, error);
    res.status(500).json({ message: `Error fetching image: ${error.message}` });
  }
};

module.exports = {
  profileUploader,
  getProfileById,
};
