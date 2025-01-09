const express = require("express");
const router = express.Router();
const DashboardData = require("../models/DashboardData");
const Order = require("../models/Order");

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
        { title: "Total Orders Delivered", value: 0 },
        { title: "Total Orders Returned", value: 0 },
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
    const { eventType, orderData } = req.body;

    //const { statusData, summaryData } = req.body;

    // Retrieve today's data
    let data = await DashboardData.findOne({ date: today });

    if (!dashboard) {
      dashboard = new DashboardData({
        date: today,
        statusData: [],
        summaryData: [],
      });
    }

    // Update statusData (Current Date)
    if (eventType === "newOrder") {
      dashboard.statusData = updateStatusCardData(dashboard.statusData, orderData);
    } else if (eventType === "statusChange") {
      dashboard.statusData = updateStatusCardOnStatusChange(dashboard.statusData, orderData);
    }

    // Update summaryData (All-Time)
    dashboard.summaryData = updateSummaryCardData(dashboard.summaryData, orderData);

    await dashboard.save();
    res.status(200).json(dashboard);
  } catch (error) {
    res.status(500).json({ message: "Error updating dashboard", error: error.message });
  }
});

// Helper Functions
const updateStatusCardData = (statusData, orderData) => {
  // Update New Orders, Units Sold, etc.
  return statusData.map((item) => {
    if (item.title === "New Orders") {
      return { ...item, value: item.value + 1 };
    } else if (item.title === "Units Sold") {
      const units = orderData.products.reduce((sum, p) => sum + p.quantity, 0);
      return { ...item, value: item.value + units };
    }
    return item;
  });
};

const updateSummaryCardData = (summaryData, orderData) => {
  // Update Total Sales, Total Orders, etc.
  return summaryData.map((item) => {
    if (item.title === "Total Orders") {
      return { ...item, value: item.value + 1 };
    } else if (item.title === "Total Sales") {
      return { ...item, value: item.value + orderData.totalPrice };
    }
    return item;
  });
};

module.exports = router;