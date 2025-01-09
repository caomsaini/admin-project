import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardContent, Typography, Box, Select, MenuItem, CircularProgress } from "@mui/material";
import "leaflet/dist/leaflet.css";
import "../styles/Analytics.css";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const AnalyticsDashboard = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [filter, setFilter] = useState("last7days");
  const [metrics, setMetrics] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time active users
    socket.on("active-users", (count) => setActiveUsers(count));
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/analytics/metrics?filter=${filter}`);
        const data = await response.json();

        if (data && data.userGrowth) {
          setMetrics(data);

          // Prepare chart data
          setChartData({
            labels: data.userGrowth.map((entry) => entry.date),
            datasets: [
              {
                label: "User Growth",
                data: data.userGrowth.map((entry) => entry.count),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          });
        } else {
          setChartData(null); // No data available
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchHeatmapData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/heatmaps");
        const data = await response.json();
        setHeatmapData(data || []); // Default to empty array if no data
      } catch (error) {
        console.error("Error fetching heatmap data:", error);
      }
    };

    fetchMetrics();
    fetchHeatmapData();
  }, [filter]);

  return (
    <div className="analytics-dashboard">
      <Typography variant="h4" align="center" gutterBottom>
        Analytics Dashboard
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <CircularProgress />
        </Box>
      ) : (
        <Box className="grid-container">
          {/* Active Users */}
          <Card className="grid-item">
            <CardContent>
              <Typography variant="h6">Active Users</Typography>
              <Typography variant="h3" style={{ color: "green" }} align="center">
                {activeUsers}
              </Typography>
            </CardContent>
          </Card>

          {/* User Growth Chart */}
          <Card className="grid-item">
            <CardContent>
              <Typography variant="h6">User Growth</Typography>
              {chartData ? (
                <Line data={chartData} />
              ) : (
                <Typography align="center" color="textSecondary">
                  No data available
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Heatmap */}
          <Card className="grid-item">
            <CardContent>
              <Typography variant="h6">User Locations</Typography>
              <MapContainer center={[51.505, -0.09]} zoom={3} style={{ height: "400px" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {heatmapData.map((point, index) => (
                  <Marker key={index} position={[point.latitude, point.longitude]}>
                    <Popup>{point.location}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </CardContent>
          </Card>
        </Box>
      )}

      <Box mt={3} textAlign="center">
        <Typography variant="h6">Filter by:</Typography>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="last7days">Last 7 Days</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
        </Select>
      </Box>
    </div>
  );
};

export default AnalyticsDashboard;