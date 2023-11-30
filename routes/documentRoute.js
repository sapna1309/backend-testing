const express = require("express");
const router = express.Router();
const upload = require("./saveToCloud")
const { 
    documentUploader,
    verifyDocument,
    getAllDocuments} = require("../controllers/documentController");


router.post("/document-upload/:userId", upload.single("document"), documentUploader);

router.patch("/verify-document/:id", verifyDocument);

router.get("/get-all", getAllDocuments);

module.exports = router;