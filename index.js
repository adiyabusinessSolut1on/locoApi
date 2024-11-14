const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());
mongoose.set("strictQuery", false);
require("dotenv").config();
const { Server } = require("socket.io");
const { createServer } = require("http");
const usersRoute = require("./route/userRoute");
const chatsRoute = require("./route/chatsRoute");
const messagesRoute = require("./route/messagesRoute");
const blogRoute = require("./route/admin/blogs.js");
const videoRoute = require("./route/admin/video.js");
const adminRoute = require("./route/admin/adminRoute.js");
const awarenessRoute = require("./route/admin/awarenessRoute.js");
const importantLinks = require("./route/admin/implinksRoute.js");
const sponsorRoute = require("./route/admin/sponsorRoute.js");
const quizRoute = require("./route/admin/quizRoute.js");
const testYourSelfRoute = require("./route/admin/test_yourselfRoute.js");
const DailyTaskRoute = require("./route/admin/dailytaskRoute.js");
const quiztestRoute = require("./route/quiztestRoutes.js");
const pollRoute = require("./route/pollRoute.js");
const Blog = require("./route/blog.js");
const reportRoute = require("./route/reportRoute.js");
const server = createServer(app);

const Poll = require("./model/pollModel.js");
const checkTimeLimits = async () => {
  const now = new Date();
  await Poll.updateMany(
    { timelimit: { $lte: now }, isActive: true },
    { $set: { isActive: false } }
  );
};
setInterval(checkTimeLimits, 60 * 1000);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["Get", "Post", "Put", "Delete"],
    credentials: true,
  },
});
// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
// }));

app.get("/", (req, res) => {
  res.send("WebSocket server is running");
});
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("connection failed", err);
  });
app.use(require("./route/userRoute.js"));
app.use("/api/users", quiztestRoute);
app.use("/api/users", usersRoute);
app.use("/api/users", pollRoute);
app.use("/api/chats", chatsRoute);
app.use("/api/messages", messagesRoute);
app.use("/api/admin", blogRoute);
app.use("/api/admin", videoRoute);
app.use("/api/admin", adminRoute);
app.use("/api/admin", awarenessRoute);
app.use("/api/admin", importantLinks);
app.use("/api/admin", sponsorRoute);
app.use("/api/admin", quizRoute);
app.use("/api/admin", testYourSelfRoute);
app.use("/api/admin", DailyTaskRoute);
app.use("/api/user/blog", Blog);
app.use("/api/admin", reportRoute);

server.listen(process.env.PORT, (port) => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
let onlineUsers = [];

io.on("connection", (socket) => {
  socket.on("join-room", (userId) => {
    socket.join(userId);
  });

  socket.on("send-message", (message) => {
    io.to(message.members[0])
      .to(message.members[1])
      .emit("receive-message", message);
  });

  socket.on("clear-unread-messages", (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit("unread-messages-cleared", data);
  });

  socket.on("typing", (data) => {
    io.to(data.members[0]).to(data.members[1]).emit("started-typing", data);
  });

  socket.on("came-online", (userId) => {
    if (!onlineUsers.includes(userId)) {
      onlineUsers.push(userId);
    }

    io.emit("online-users-updated", onlineUsers);
  });

  socket.on("went-offline", (userId) => {
    onlineUsers = onlineUsers.filter((user) => user !== userId);
    io.emit("online-users-updated", onlineUsers);
  });
});

// let onlineUser = [];

// io.on("connection", (socket) => {
//   console.log("connection socket Established", socket.id);
//   socket.on("NewUser", (userId) => {
//     !onlineUser.some((user) => user.userId === userId) &&
//       onlineUser.push({
//         userId,
//         socketId: socket.id,
//       });
//     io.emit("getonlineUser", onlineUser);
//   });
//   socket.on("sendMessage", (msg) => {
//     const user = onlineUser?.find((use) => use?.userId === msg?.recipientId);
//     if (user) {
//       io.emit("getMessage", msg);
//       io.emit("getNotification", {
//         senderId: msg?.senderId,
//         isRead: false,
//         date: new Date(),
//       });
//     }
//   });
//   socket.on("disconnect", () => {
//     onlineUser = onlineUser.filter((user) => user?.userId !== socket.id);
//     io.emit("getonlineUser", onlineUser);
//   });
// })
