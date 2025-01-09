import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "../styles/Orders.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import arrow from "../assets/icons-arrow.png";
import arrowback from "../assets/icons-arrow-back.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import OrderIcon from "@mui/icons-material/ShoppingCart";
import UserIcon from "@mui/icons-material/People";
import ReportIcon from "@mui/icons-material/BarChart";
import ProductIcon from "@mui/icons-material/StoreRounded";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const socket = io("http://localhost:5000");

const OrderPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/orders");
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    fetchOrders();

     // Listen for WebSocket Events
     const socket = io("http://localhost:5000");
     socket.on("newOrder", (newOrder) => {
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
    });

    socket.on("orderStatusUpdate", (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder.id ? { ...order, status: updatedOrder.status } : order
        )
      );
    });

    return () => socket.disconnect();
  }, []);
  

  // Action Handlers
  const handleAction = async (_id, orderId, action) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${_id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === _id  ? { ...order, status: updatedOrder.status } : order
          )
        );
        alert("Order ${orderId} status updated successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error.message);
      alert("An error occurred while updating the order status");
    }
  };

  // Navigate to Order Details
  const handleOrderClick = (orderId) => {
    setLoading(true);
    setProgress(0);
    simulateProgress(() => {
      navigate(`/order-details/${orderId}`);
    });
  };

  const handleSidebarClick = (path) => {
    setLoading(true);
    setProgress(0);
    simulateProgress(() => {
      navigate(path);
      setLoading(false);
    });
  };

  // Simulate Progress Animation
  const simulateProgress = (callback) => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        callback();
      }
    }, 100); // Adjust speed as needed
  };

  return (
    <div className={`admin-panel ${sidebarOpen ? "open" : "collapsed"}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <ul>
          <li onClick={() => handleSidebarClick("/dashboard")}>
            <span className="icon">
              <DashboardIcon />
            </span>
            {sidebarOpen && <span className="text">Dashboard</span>}
          </li>
          <li onClick={() => handleSidebarClick("/orders")}>
            <span className="icon">
              <OrderIcon />
            </span>
            {sidebarOpen && <span className="text">Orders</span>}
          </li>
          <li onClick={() => handleSidebarClick("/products")}>
            <span className="icon">
              <ProductIcon />
            </span>
            {sidebarOpen && <span className="text">Products</span>}
          </li>
          <li onClick={() => handleSidebarClick("/users")}>
            <span className="icon">
              <UserIcon />
            </span>
            {sidebarOpen && <span className="text">Users</span>}
          </li>
          <li onClick={() => handleSidebarClick("/reports")}>
            <span className="icon">
              <ReportIcon />
            </span>
            {sidebarOpen && <span className="text">Reports</span>}
          </li>
        </ul>
        <button
          className="toggle-btn"
          style={{
            marginLeft: sidebarOpen ? "105px" : "5px",
          }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <img
            src={sidebarOpen ? arrowback : arrow}
            alt="Arrow back icon"
            className="toggle-icon"
          />
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Header />
        <h2 className="header-title">Orders</h2>

        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Customer Name</th>
                <th>Products</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="clickable" onClick={() => handleOrderClick(order.id)}>
                    {order.id || "N/A"}
                  </td>
                  <td>{order.date ? new Date(order.date).toLocaleDateString() : "Unknown"}</td>
                  <td>{order.customer?.name || "Unknown"}</td>
                  <td>
                    {order.products.map((product, index) => (
                      <div key={index}>
                        {product.productId?.name || "Unknown Product"} (x{product.quantity})
                      </div>
                    ))} 
                  </td>
                  <td>₹ {order.totalPrice.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td className="actions">
                    {order.status === "Pending" && (
                      <button
                        className="action-btn"
                        onClick={() => handleAction(order._id, order.id, "Ready to Dispatch")}
                      >
                        Mark RTD
                      </button>
                    )}
                    {order.status === "Ready to Dispatch" && (
                      <button
                        className="action-btn"
                        onClick={() => handleAction(order._id, order.id, "Shipped")}
                      >
                        Mark Shipped
                      </button>
                    )}
                    {order.status === "Shipped" && (
                      <button
                        className="action-btn"
                        onClick={() => handleAction(order._id, order.id, "Delivered")}
                      >
                        Mark Delivered
                      </button>
                    )}
                    <button
                      className="action-btn"
                      onClick={() => handleAction(order._id, order.id, "generateInvoice")}
                    >
                      Generate Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      {loading && (
        <div className="loading-overlay">
          <div className="progress-container">
            <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              styles={buildStyles({
                textSize: "16px",
                pathColor: "#ff2727",
                textColor: "#ff2727",
                trailColor: "#ddd",
              })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;