const express = require("express");
const router = express.Router();
// Uncomment if using a database model
// const Notification = require("../models/Notification");

// Dummy data for testing
let notifications = [
  { id: 1, message: "New order received", timestamp: new Date(), read: false },
  { id: 2, message: "Order return requested", timestamp: new Date(), read: false },
  { id: 3, message: "Product added successfully", timestamp: new Date(), read: false },
  { id: 4, message: "New User registered", timestamp: new Date(), read: false },
  { id: 5, message: "New Customer added", timestamp: new Date(), read: false },
];

// GET /notifications - Fetch all notifications
router.get("/", async (req, res) => {
  try {
    // Uncomment for database use:
    // const notifications = await Notification.find({});
    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: "No notifications found" });
    }

    console.log("Fetched Notifications:", notifications); // Debugging
    res.json(notifications);
  } catch (error) {
    console.error("Error in GET /notifications:", error.message);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// Fetch Notifications
router.get("/", (req, res) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const filteredNotifications = notifications.filter(
    (notif) => notif.timestamp.toISOString().split("T")[0] === currentDate
  );
  res.json(filteredNotifications);
});

// Mark notification as read
router.post("/mark-as-read", (req, res) => {
  const { id } = req.body;
  notifications = notifications.map((notification) =>
    notification.id === id ? { ...notification, read: true } : notification
  );
  res.json({ message: "Notification marked as read" });
});

module.exports = router;
