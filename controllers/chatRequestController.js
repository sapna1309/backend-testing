const ChatRequest = require("../models/chatRequest");
const socketIO = require("socket.io");

function generateRequestId(senderId, receiverId) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${senderId}_${receiverId}_${timestamp}_${random}`;
}

const createRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    // Check if the request already exists
    const existingRequest = await ChatRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    // Create a new chat request
    const newRequest = new ChatRequest({
      sender: senderId,
      receiver: receiverId,
      requestId: generateRequestId(senderId, receiverId),
    });

    await newRequest.save();

    const io = socketIO();
    const receiverSocket = io.sockets.sockets[receiverId];

    if (receiverSocket) {
      receiverSocket.emit("chatRequestSent", {
        requestId: newRequest.requestId,
      });
    }

    res.status(201).json({ message: "Request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const { _id } = req.body;

    // Find the chat request
    const chatRequest = await ChatRequest.findOne({ _id })

    if (!chatRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Update the status to 'accepted'
    chatRequest.status = "accepted";
    await chatRequest.save();

    // You can implement further logic to enable the chat box, etc.

    res.status(200).json({ message: "Request accepted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const { _id } = req.body;

    // Find the chat request
    const chatRequest = await ChatRequest.findOne({ _id });

    if (!chatRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Update the status to 'rejected'
    chatRequest.status = "rejected";
    await chatRequest.save();

    res.status(200).json({ message: "Request rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const receiver = req.params.receiver;
    const notifications = await ChatRequest.find({
      receiver,
      status: "pending",
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAcceptedRequests = async (req, res) => {
  try {
    const userId = req.params.id;
    const notifications = await ChatRequest.find({
      $or: [{ receiver: userId }, { sender: userId }],
      status: "accepted",
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  acceptRequest,
  createRequest,
  rejectRequest,
  getPendingRequests,
  getAcceptedRequests,
};
