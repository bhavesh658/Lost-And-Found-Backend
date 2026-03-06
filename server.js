const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http"); // 1. HTTP module import kiya
const { Server } = require("socket.io"); // 2. Socket.io import kiya
const connectDB = require("./config/db");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const claimRoutes = require("./routes/claimRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config();
connectDB();

const app = express();

// 3. HTTP Server banaya (Socket.io ke liye zaroori hai)
const server = http.createServer(app);

// 4. Socket.io Configuration
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://lost-and-found-frontend-3lqr.onrender.com"], // Apna frontend link yahan daalein
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (res) => {
  res.send("Backend Running with Real-time Chat 🚀");
});

// 5. Socket.io Connection Logic
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // User specific room join karega (ItemId based)
  socket.on("join_room", (itemId) => {
    socket.join(itemId);
    console.log(`User joined room: ${itemId}`);
  });

  // Message receive karke room mein sabko bhejna
  socket.on("send_message", (data) => {
    // data mein text, sender, time aur roomId hota hai
    socket.to(data.roomId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// 6. app.listen ki jagah server.listen use karein
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;