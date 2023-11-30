const Comment = require("../models/commentModel");

const saveComment = async (req, res) => {
  try {
    const { postId, author, commentAuthor, content, profileUrl, name } =
      req.body;

    if (!content.length) {
      return res.status(401).json({ error: "Can't Comment empty" });
    }

    const newComment = new Comment({
      postId,
      author,
      commentAuthor,
      content,
      profileUrl,
      name,
    });

    await newComment.save();

    res.json({ message: "Comment saved successfully" });
  } catch (error) {
    console.log("Error saving comment:", error);
    res.status(500).json({ error: "Error saving comment" });
  }
};

const getComments = async (req, res) => {
  const postId = req.params.postId;

  try {
    const comments = await Comment.find({ postId });
    res.json(comments);
  } catch (error) {
    console.log("Error fetching comments:", error);
    res.status(500).json({ error: "Error fetching comments" });
  }
};


const deleteSingleComment=async(req,res)=>{
  const { id } = req.params;
  const { userId } = req.body;
  try {
    if (id) {
      const comment = await Comment.findOne({_id:id,$or: [{ author: userId }, { commentAuthor: userId }]});
      if (comment){
        const deletedComment = await Comment.findByIdAndDelete({ _id: id });
        if (deletedComment) {
          res.status(202).json({ message: "Comment removed successfully." });
        } else {
          res.status(404).json({ error: "Unable to find comment" });
        }
      }else{
        res.status(403).json({ error: "You don't have access to remove this comment." });
      }
    } else {
      res.status(404).json({ error: "Unable to find comment" });
    }
  } catch (error) {
    console.error("Error in deleteSingleComment controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  saveComment,
  getComments,
  deleteSingleComment
};
