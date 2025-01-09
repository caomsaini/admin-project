import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/dashboard/stats"); // Assuming this endpoint returns stats.
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="dashboard-stats">
        <Card title="Total Orders" value={stats.totalOrders} />
        <Card title="Total Sales" value={stats.totalSales} />
        <Card title="Units Sold" value={stats.unitsSold} />
        <Card title="Pending RTD" value={stats.pendingRTD} />
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="dashboard-card">
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

export default Dashboard;
