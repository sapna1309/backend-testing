require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const authRoute = require("./routes/authRoute");
const likedPostsRoute = require("./routes/likedPostsRoute");
const followedUsersRoute = require("./routes/followUserRoute");
const commentRoute = require("./routes/commentRoute");
const profileRoute = require("./routes/profileRoute");
const documentRoute = require("./routes/documentRoute");
const chatRequestRoute = require("./routes/chatRequestRoute");
const connection = require("./config/db");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();
app.use(express.json());

app.use(cors());

// Serve static images from the 'uploads' directory
app.use("/uploads", express.static("uploads"));

// Include routes
app.use("/registration", userRoute);
app.use("/post", postRoute);
app.use("/auth", authRoute);
app.use("/like", likedPostsRoute);
app.use("/comment", commentRoute);
app.use("/profile", profileRoute);
app.use("/document", documentRoute);
app.use("/follow", followedUsersRoute);
app.use("/chat-request", chatRequestRoute);

// Socket.io
const server = createServer(app);

const io = new Server();

io.on("connection", (socket) => {
  socket.on("chatRequestSent", (data) => {
    io.emit("chatRequestSent", data);
  });

  socket.on("chatRequestAccepted", (data) => {
    io.emit("chatRequestAccepted", data);
  });

  socket.on("chatRequestRejected", (data) => {
    io.emit("chatRequestRejected", data);
  });
});

server.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log(`Server is running at port ${process.env.PORT}`);
  } catch (error) {
    console.log("Not able to connect to DB", error);
  }
});
