const Order = require("../models/Order");
const DashboardData = require("../models/DashboardData");

// Create new order
const createOrder = async (req, res) => {
  try {
    const { customer, products, totalPrice, status } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Products cannot be empty." });
    }

    const newOrder = await Order.create({ customer, products, totalPrice, status });

    // Update Dashboard Data
    const today = new Date().toISOString().split("T")[0];
    const unitsSold = products.reduce((sum, product) => sum + product.quantity, 0);

    await DashboardData.findOneAndUpdate(
      { date: today },
      {
        $inc: {
          "statusData.$[newOrders].value": 1,
          "statusData.$[unitsSold].value": unitsSold,
          "summaryData.$[totalOrders].value": 1,
          "summaryData.$[totalUnitsSold].value": unitsSold,
          "summaryData.$[totalSales].value": totalPrice,
        },
      },
      {
        arrayFilters: [
          { "newOrders.title": "New Orders" },
          { "unitsSold.title": "Units Sold" },
          { "totalOrders.title": "Total Orders" },
          { "totalUnitsSold.title": "Total Units Sold" },
          { "totalSales.title": "Total Sales" },
        ],
        new: true,
        upsert: true,
      }
    );
// Emit WebSocket Event for Real-Time Update
const io = req.app.get("io");
io.emit("newOrder", newOrder);

res.status(201).json(newOrder);
} catch (error) {
console.error("Error creating order:", error.message);
res.status(400).json({ message: error.message });
}
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("products.productId", "name price")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const previousStatus = order.status; // Get current status before update

    // Update order status
    order.status = status;
    await order.save();

    const today = new Date().toISOString().split("T")[0];
    const statusMappings = {
      Pending: "New Orders",
      "Ready to Dispatch": "Ready to Dispatch",
      Shipped: "Shipped",
      Delivered: "Delivered",
      Return: "Returned",
    };

    const summaryMappings = {
      Shipped: "Total Orders Shipped",
      Delivered: "Total Orders Delivered",
      Return: "Total Orders Returned",
    };

    if (statusMappings[previousStatus] || statusMappings[status]) {
    const statusUpdates = {};

    if (statusMappings[previousStatus]) {
      statusUpdates[`statusData.$[prevStatus].value`] = -1; // Decrement previous status
    }
    if (statusMappings[status]) {
      statusUpdates[`statusData.$[newStatus].value`] = 1; // Increment new status
    }

    await DashboardData.findOneAndUpdate(
      { date: today },
      { $inc: statusUpdates },
      {
        arrayFilters: [
          { "prevStatus.title": statusMappings[previousStatus] },
          { "newStatus.title": statusMappings[status] },
        ],
        new: true,
      }
    );
  }


  if (summaryMappings[status]) {
    await DashboardData.findOneAndUpdate(
      { date: today },
      {
        $inc: {
          "summaryData.$[summaryStatus].value": 1,
        },
      },
      {
        arrayFilters: [{ "summaryStatus.title": summaryMappings[status] }],
        new: true,
      }
    );
  }

    const io = req.app.get("io");
    io.emit("orderStatusUpdate", { id, status }); // WebSocket event for real-time updates

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
