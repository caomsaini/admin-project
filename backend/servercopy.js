require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const heatmapRoutes = require("./routes/heatmapRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboard");

// Middleware
const { protect, admin } = require("./middlewares/authMiddleware");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
connectDB();

// Real-Time Users
const activeUsers = new Set();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  activeUsers.add(socket.id);
  io.emit("active-users", activeUsers.size);

  socket.on("disconnect", () => {
    activeUsers.delete(socket.id);
    io.emit("active-users", activeUsers.size);
    console.log(`User disconnected: ${socket.id}`);
  });

    console.log("New WebSocket Connection:", socket.id);
  
    socket.on("visitor-data", async (data) => {
      try {
        const { ip, page, sessionId, duration } = data;
        const geo = geoip.lookup(ip) || {};
  
        const session = await Analytics.findById(sessionId);
        if (session) {
          session.pagesVisited.push({ url: page, duration });
          await session.save();
  
          io.emit("new-analytics", session);
        } else {
          const newAnalytics = new Analytics({
            ip,
            location: { city: geo.city || "", country: geo.country || "" },
            pagesVisited: [{ url: page, duration }],
          });
  
          const savedAnalytics = await newAnalytics.save();
          io.emit("new-analytics", savedAnalytics);
        }
      } catch (error) {
        console.error("Error processing visitor data:", error);
      }
    });
  
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });  
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => res.send("API Server is Live!"));
app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/heatmaps", heatmapRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", protect, admin, userRoutes);
app.use("/api/products", protect, productRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));