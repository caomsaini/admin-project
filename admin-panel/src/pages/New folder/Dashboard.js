import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import { io } from "socket.io-client";
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

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [statusData, setStatusData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const defaultStatusTitles = [
    "New Customers",
    "New Orders",
    "Units Sold",
    "Ready to Dispatch",
    "Shipped",
    "Delivered",
    "Return Pickup",
    "Return Received",
  ];
  const defaultSummaryTitles = [
    { title: "Total Customers", key: "totalCustomers" },
    { title: "Total Orders", key: "totalOrders" },
    { title: "Total Sales", key: "totalSales" },
    { title: "Total Units Sold", key: "totalUnitsSold" },
    { title: "Total Orders Shipped", key: "totalOrdersShipped" },
    { title: "Total Delivered Orders", key: "totalDeliveredOrders" },
    { title: "Total Returned Orders", key: "totalReturnedOrders" },
    { title: "Total Return Received", key: "totalReturnReceived" },
  ];

  // WebSocket for Real-Time Updates
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("dashboardUpdate", (data) => {
      setStatusData((prevStatusData) =>
        data.statusData.map((newItem) => {
          const existingItem = prevStatusData.find(
            (item) => item.title === newItem.title
          );
          return existingItem ? { ...existingItem, value: newItem.value } : newItem;
        })
      );

      setSummaryData((prevSummaryData) =>
        data.summaryData.map((newItem) => {
          const existingItem = prevSummaryData.find(
            (item) => item.title === newItem.title
          );
          return existingItem ? { ...existingItem, value: newItem.value } : newItem;
        })
      );
    });

    return () => socket.disconnect();
  }, []);

  // Fetch Initial Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard");
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        setStatusData(data.statusData || []);
        setSummaryData(data.summaryData || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
      }
    };

    fetchDashboardData();
  }, []);

  // Fill missing cards with default titles
  const completeStatusData = defaultStatusTitles.map((title) => {
    const existing = statusData.find((item) => item.title === title);
    return existing || { title, value: 0 }; // Default to zero if no data exists
  });

  const completeSummaryData = defaultSummaryTitles.map((item) => {
    const existing = summaryData.find((data) => data.title === item.title);
    return existing || { title: item.title, value: 0 }; // Default to zero if no data exists
  });

  // Redirect Handlers
  const handleCardClick = (title) => {
    setLoading(true);
    setProgress(0);
    simulateProgress(() => {
    switch (title) {
      case "New Customers":
      case "Total Customers":
        navigate("/customers", { state: { filter: "all" } });
        break;
      case "New Orders":
      case "Total Orders":
        navigate("/orders", { state: { filter: "all" } });
        break;
      case "Units Sold":
      case "Total Units Sold":
        navigate("/sales");
        break;
      case "Ready to Dispatch":
        navigate("/orders", { state: { filter: "readyToDispatch" } });
        break;
      case "Shipped":
      case "Total Orders Shipped":
        navigate("/orders", { state: { filter: "shipped" } });
        break;
      case "Delivered":
      case "Total Delivered Orders":
        navigate("/orders", { state: { filter: "delivered" } });
        break;
      case "Return Pickup":
        navigate("/returns", { state: { filter: "pickup" } });
        break;
      case "Return Received":
      case "Total Return Received":
        navigate("/returns", { state: { filter: "received" } });
        break;
      case "Total Sales":
        navigate("/sales");
        break;
      case "Total Returned Orders":
        navigate("/returns", { state: { filter: "returnedOrders" } });
        break;
      default:
        navigate("/dashboard");
    }
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
    }, 200); // Adjust speed as needed
  };

  const handleSidebarClick = (path) => {
    setLoading(true);
    setProgress(0);
    simulateProgress(() => {
    navigate(path);
    setLoading(false);
  });
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
            marginLeft: sidebarOpen ? "105px" : "5px", // Adjust dynamically based on sidebar state
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
        <Header /> {/* Top Header */}
        <h2
          className="header-title"
          style={{
            marginLeft: sidebarOpen ? "1px" : "1px", // Adjust dynamically based on sidebar state
          }}
        >
          Dashboard
        </h2>

        {/* Status Cards */}
        <div className="status-cards">
          {completeStatusData.map((status, index) => (
            <div
              className="status-card clickable" // Added 'clickable' class for cursor pointer
              key={index}
              onClick={() => handleCardClick(status.title)}
            >
              <h3>{status.title}</h3>
              <p>{status.value}</p>
            </div>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          {completeSummaryData.map((item, index) => (
            <div
              className="summary-card clickable" // Added 'clickable' class for cursor pointer
              key={index}
              onClick={() => handleCardClick(item.title)}
            >
              <h3>{item.title}</h3>
              <p>{item.value}</p>
            </div>
          ))}
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

export default Dashboard;
