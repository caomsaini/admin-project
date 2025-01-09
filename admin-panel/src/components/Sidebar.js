import React from "react";
import "../styles/Sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import OrderIcon from "@mui/icons-material/ShoppingCart";
import UserIcon from "@mui/icons-material/People";
import ReportIcon from "@mui/icons-material/BarChart";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li><DashboardIcon /> Dashboard</li>
        <li><OrderIcon /> Orders</li>
        <li><UserIcon /> Users</li>
        <li><ReportIcon /> Reports</li>
      </ul>
    </div>
  );
}

export default Sidebar;
