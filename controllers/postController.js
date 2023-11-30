const cloudinary = require("../config/cloudinary");
const Post = require("../models/postModel");
const Comments = require("../models/commentModel");

const createPost = async (req, res) => {
  try {
    const { content, gender } = req.body;
    let image = "";

    if (req.file) {
      image = req.file.path;
    }
    const imageUrlResult = await cloudinary.uploader.upload(req.file.path);
    if (!imageUrlResult) {
      console.log("Error while uploading image while creating post")
      return res.status(400).json("Error in Uploading Image while creating post")
    }

    if (!content.length && !image.length) {
      return res.status(401).json({ error: "Can't post empty" });
    }

    const newPost = new Post({
      author: req.body.authorId,
      content,
      image: imageUrlResult.url,
      gender,
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", data: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

const getAllPosts = async (req, res) => {
  const { gender } = req.body;
  const queryGender = gender === "Male" ? "Female" : "Male";

  try {
    // const posts = await Post.find({
    //   $or: [{ author: userId }, { gender: queryGender }],
    // })
    const posts = await Post.find({ gender: queryGender }).populate(
      "author",
      "name email gender"
    );

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSinglePosts = async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await Post.find({ author: id }).populate(
      "author",
      "name email gender"
    );

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const deleteSinglePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    if (id) {
      const post = await Post.findOne({ author: userId,_id:id });
      if (post){
        const deletedComments = await Comments.deleteMany({ postId: id });
        const deletedPost = await Post.findByIdAndDelete({ _id: id });
        if (deletedPost) {
          res.status(202).json({ message: "Post removed successfully." });
        } else {
          res.status(404).json({ error: "Unable to find post" });
        }
      }else{
        res.status(403).json({ error: "You don't have access to remove this post." });
      }
    } else {
      res.status(404).json({ error: "Unable to find post" });
    }
  } catch (error) {
    console.error("Error in deleteSinglePost controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


module.exports = {
  createPost,
  getAllPosts,
  getSinglePosts,
  deleteSinglePost
};
