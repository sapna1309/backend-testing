const { DocumentModel } = require("../models/documentModel");
const cloudinary = require("../config/cloudinary");
require("dotenv").config();

const documentUploader = async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log("documentUserId", documentUserId)

    await cloudinary.uploader.upload(req.file.path, async (err, result) => {
      if (err) {
        console.error("Error while uploading document", err);
        return res.status(500).json({ error: "Unable to upload document" });
      }
      const documentAdded = new DocumentModel({
        documentUrl: result.url,
        userId,
      });
      // console.log(existUrl);

      await documentAdded.save();
      res.status(201).json({message:"New document uploaded successfully"});
    });
  } catch (error) {
    console.log("Unable to upload Doc", error);
    res.status(400).send(error);
  }
};

const verifyDocument = async (req, res) => {
  try {
    const documentId = req.params.id;

    let document = await DocumentModel.findByIdAndUpdate(documentId, {
      approved: true,
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json({ message: "Document approved successfully" });
  } catch (error) {
    console.error("Unable to verify Doc", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllDocuments = async(req,res)=>{

  try {
    let allDocuments = await DocumentModel.find();
    res.status(200).json({message:"All the documents",data:allDocuments})
  } catch (error) {
    console.error("Unable to get all the documents", error);
    res.status(500).json({ error: "Internal Server Error while getting all the documents" });
  }
}




module.exports = { 
  documentUploader,
  verifyDocument,
  getAllDocuments
};
