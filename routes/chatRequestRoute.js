const express = require("express");
const router = express.Router();
const {
  createRequest,
  acceptRequest,
  rejectRequest,
  getPendingRequests,
  getAcceptedRequests
} = require("../controllers/chatRequestController");

router.post("/create", createRequest);
router.post("/accept", acceptRequest);
router.post("/reject", rejectRequest);
router.get("/get-pending/:receiver", getPendingRequests);
router.get("/get-accepted/:id", getAcceptedRequests);

module.exports = router;
