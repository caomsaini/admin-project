const Order = require('../models/Order');

// Create new order
const createOrder = async (req, res) => {
    try {
        console.log(req.body);
        const { id, date, customer, products, totalPrice, status } = req.body;
        const newOrder = await Order.create({ id, date, customer, products, totalPrice, status });
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
      
// Get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customer', 'name') // Ensure 'customer' references a valid model
            .populate("products.productId", "name", "color", "quantity"); // Ensure 'productId' references a valid model
            
            // Handle missing customer or productId references
    const sanitizedOrders = orders.map((order) => ({
      ...order._doc,
      customer: order.customer || { name: "Unknown" },
      products: order.products.map((product) => ({
        ...product,
        productId: product.productId || { name: "Unknown Product" },
      })),
    }));

    res.status(200).json(sanitizedOrders);
  } catch (error) {
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
  
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found.' });
      }
  
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

module.exports = { createOrder, getOrders, updateOrderStatus };
