const express = require("express");
const router = express.Router();
const DashboardData = require("../models/DashboardData");

// Helper Function: Get Cumulative Summary
const getCumulativeSummary = async () => {
  const lastEntry = await DashboardData.findOne().sort({ date: -1 });
  return lastEntry
    ? lastEntry.summaryData.map((item) => ({
        title: item.title,
        value: item.value,
      }))
    : [
        { title: "Total Customers", value: 0 },
        { title: "Total Orders", value: 0 },
        { title: "Total Sales", value: 0 },
        { title: "Total Units Sold", value: 0 },
        { title: "Total Orders Shipped", value: 0 },
        { title: "Total Delivered Orders", value: 0 },
        { title: "Total Returned Orders", value: 0 },
        { title: "Total Return Received", value: 0 },
      ];
};

// GET /api/dashboard
router.get("/", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Find today's data
    let data = await DashboardData.findOne({ date: today });

    if (!data) {
      console.log("Initializing data for today...");

      // Retrieve cumulative summary from previous entries
      const cumulativeSummary = await getCumulativeSummary();

      // Initialize default data
      const defaultData = {
        date: today,
        statusData: [
          { title: "New Customers", value: 0 },
          { title: "New Orders", value: 0 },
          { title: "Units Sold", value: 0 },
          { title: "Ready to Dispatch", value: 0 },
          { title: "Shipped", value: 0 },
          { title: "Delivered", value: 0 },
          { title: "Return Pickup", value: 0 },
          { title: "Return Received", value: 0 },
        ],
        summaryData: cumulativeSummary,
      };

      data = new DashboardData(defaultData);
      await data.save();
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error in GET /api/dashboard:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// POST /api/dashboard/realtime-update
router.post("/realtime-update", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const { statusData, summaryData } = req.body;

    // Retrieve today's data
    let data = await DashboardData.findOne({ date: today });

    if (!data) {
      console.log("Creating data for today...");

      // Retrieve cumulative summary from previous entries
      const cumulativeSummary = await getCumulativeSummary();

      // Create new entry with cumulative summary
      data = new DashboardData({
        date: today,
        statusData,
        summaryData: cumulativeSummary.map((item) => {
          const incomingItem = summaryData.find((s) => s.title === item.title);
          return {
            title: item.title,
            value: item.value + (incomingItem ? incomingItem.value : 0),
          };
        }),
      });

      await data.save();
      return res.status(200).json(data);
    }

    // Update statusData for today
    data.statusData = data.statusData.map((existingItem) => {
      const newItem = statusData.find((s) => s.title === existingItem.title);
      return newItem
        ? { title: existingItem.title, value: existingItem.value + newItem.value }
        : existingItem;
    });

    // Update summaryData cumulatively
    data.summaryData = data.summaryData.map((existingItem) => {
      const newItem = summaryData.find((s) => s.title === existingItem.title);
      return newItem
        ? { title: existingItem.title, value: existingItem.value + newItem.value }
        : existingItem;
    });

    await data.save();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in POST /api/dashboard/realtime-update:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;