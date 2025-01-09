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

// Filter Orders
const filterOrders = async (req, res) => {
  try {
    const { filterBy, filterValue } = req.query;

    const query = {};
    if (filterBy && filterValue) {
      if (filterBy === "customerName") {
        query["customer.name"] = { $regex: filterValue, $options: "i" };
      } else if (filterBy === "productName") {
        query["products.productId.name"] = { $regex: filterValue, $options: "i" };
      } else if (filterBy === "orderId") {
        query["id"] = { $regex: filterValue, $options: "i" };
      } else if (filterBy === "status") {
        query["status"] = filterValue;
      } else if (filterBy === "totalPrice") {
        query["totalPrice"] = parseFloat(filterValue);
      } else if (filterBy === "orderDate") {
        query["date"] = {
          $gte: new Date(filterValue).setHours(0, 0, 0, 0),
          $lte: new Date(filterValue).setHours(23, 59, 59, 999),
        };
      }
    }

    const orders = await Order.find(query)
      .populate("customer", "name email")
      .populate("products.productId", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error filtering orders:", error.message);
    res.status(500).json({ message: error.message });
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
    const products = order.products;
    const totalPrice = order.totalPrice;
    const unitsSold = products.reduce((sum, product) => sum + product.quantity, 0);

    // Update order status
    order.status = status;
    await order.save();

    const today = new Date().toISOString().split("T")[0];

    const statusMappings = {
      Pending: "New Orders",
      "Ready to Dispatch": "Ready to Dispatch",
      Shipped: "Shipped",
      Delivered: "Delivered",
      Cancelled: "Cancelled",
      Returned: "Returned",
    };

    const summaryMappings = {
      Shipped: "Total Orders Shipped",
      Delivered: "Total Orders Delivered",
      Cancelled: "Total Orders Cancelled",
      Returned: "Total Orders Returned",
    };

    const statusUpdates = {};

    // Decrement the previous status count
    if (statusMappings[previousStatus]) {
      statusUpdates[`statusData.$[prevStatus].value`] = -1;
    }

    // Increment the new status count
    if (statusMappings[status]) {
      statusUpdates[`statusData.$[newStatus].value`] = 1;
    }

    // Handle "Cancelled" cases
    if (["Cancelled"].includes(status)) {
      statusUpdates[`statusData.$[unitsSold].value`] = -unitsSold;
    }

    await DashboardData.findOneAndUpdate(
      { date: today },
      { $inc: statusUpdates },
      {
        arrayFilters: [
          { "prevStatus.title": statusMappings[previousStatus] || null },
          { "newStatus.title": statusMappings[status] || null },
          ...(status === "Cancelled" ? [{ "unitsSold.title": "Units Sold" }] : []),
        ],
        new: true,
      }
    );

    // Update summary mappings
    const summaryUpdates = {
      ...(summaryMappings[status] && { "summaryData.$[summaryStatus].value": 1 }),
    };

      if (status === "Cancelled") {
        summaryUpdates["summaryData.$[totalUnitsSold].value"] = -unitsSold;
        summaryUpdates["summaryData.$[totalSales].value"] = -totalPrice;
      } 

      const dashboardUpdate = await DashboardData.findOneAndUpdate(
        { date: today },
        { $inc: summaryUpdates },
        {
          arrayFilters: [
            ...(summaryMappings[status] ? [{ "summaryStatus.title": summaryMappings[status] }] : []),
            ...(status === "Cancelled" ? [
              { "totalUnitsSold.title": "Total Units Sold" },
              { "totalSales.title": "Total Sales" },
            ] : []),
          ],
          new: true,
        }
      );

      const io = req.app.get("io");
    io.emit("dashboardUpdate", dashboardUpdate); // Emit updated dashboard data
    io.emit("orderStatusUpdate", { id, orderId: order.id, status });

    res.status(200).json({ orderId: order.id, status: order.status });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus, filterOrders };
