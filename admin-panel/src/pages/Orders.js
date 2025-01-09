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
import AnalyticsIcon from '@mui/icons-material/Insights';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import generateInvoice from "../utils/generateInvoice";
//import InvoiceIcon from "../assets/invoice-icon.png";

const socket = io("http://localhost:5000");

const OrderPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({});
  const [dropdowns, setDropdowns] = useState({});
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
        setFilteredOrders(data);
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
        alert(`Order ${updatedOrder.orderId} status updated to ${updatedOrder.status}!`);
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

  const handleGenerateInvoice = (order) => {
    const invoiceData = {
      customerName: "Mahalaxmi Mobile",
      customerAddress: "Shiv Pooja Market, Kota, Rajasthan",
      customerGSTIN: "Unregistered",
      invoiceNumber: "KASO/0317/24-25",
      invoiceDate: "19-Jul-2024",
      orderNumber: "24250317",
      orderDate: "19-Jul-2024",
      paymentMode: "Cash on Delivery",
      products: [
        { name: "Mobile Battery", hsnCode: "85065000", quantity: 1, price: 331, taxableValue: 331 },
      ],
      totalAmount: 331,
    };
    generateInvoice(invoiceData);
  }         
  

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

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Apply filters
    const filtered = orders.filter((order) => {
      return Object.keys(newFilters).every((filterKey) => {
        if (!newFilters[filterKey]) return true; // Ignore empty filters
        const field = filterKey.includes(".") // Handle nested fields like `customer.name`
          ? filterKey.split(".").reduce((obj, k) => (obj ? obj[k] : null), order)
          : order[filterKey];
        return String(field).toLowerCase().includes(newFilters[filterKey].toLowerCase());
      });
    });
    setFilteredOrders(filtered);
  };

  // Toggle Dropdown Visibility
  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Clear specific filter
  const clearFilter = (key) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    handleFilterChange(key, ""); // Reapply filters
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
          <li onClick={() => handleSidebarClick("/analytics")}>
            <span className="icon">
              <AnalyticsIcon />
            </span>
            {sidebarOpen && <span className="text">Analytics</span>}
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
            marginTop: "325px",
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
                {[
                  { key: "id", label: "Order ID" },
                  { key: "date", label: "Order Date" },
                  { key: "customer.name", label: "Customer Name" },
                  { key: "products", label: "Products" },
                  { key: "totalPrice", label: "Total Price" },
                  { key: "status", label: "Status" },
                ].map((column) => (
                  <th key={column.key}>
                    {column.label}
                    <ArrowDropDownIcon
                      className="filter-icon"
                      onClick={() => toggleDropdown(column.key)}
                    />
                    {dropdowns[column.key] && (
                      <div className="dropdown-menu">
                        <input
                          type="text"
                          placeholder={`Filter ${column.label}`}
                          value={filters[column.key] || ""}
                          onChange={(e) => handleFilterChange(column.key, e.target.value)}
                        />
                        <ul>
                          {[...new Set(orders.map((o) => o[column.key]))]
                            .filter((item) => item)
                            .map((item) => (
                              <li
                                key={item}
                                onClick={() => handleFilterChange(column.key, item)}
                              >
                                {item}
                              </li>
                            ))}
                        </ul>
                        {filters[column.key] && (
                          <button onClick={() => clearFilter(column.key)}>Clear</button>
                        )}
                      </div>
                    )}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
                {filteredOrders.map((order) => (
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
                    <button className="action-btn" onClick={() => handleGenerateInvoice(order)}>
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