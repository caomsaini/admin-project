import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [notifications, setNotifications] = useState([
    "New Order Received",
    "Order return requested",
    "Product Added Successfully",
    "User Registered",
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and navigate to login page
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage
        const { data } = await axios.get("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` }, // Include token in the request
        });
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-logo">
        <h2>SAMPLE</h2>
      </div>

      {/* Search Bar */}
      <div className="header-search">
        <input type="text" placeholder="Search..." />
        <button>Search</button>
      </div>

      {/* Notification Bell */}
      <div className="header-icons">
        <div
          className="notification-bell"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <span className="bell-icon">🔔</span>
          {notifications.length > 0 && (
            <span className="notification-count">{notifications.length}</span>
          )}
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="notifications-dropdown">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={index} className="notification-item">
                  {notification}
                </div>
              ))
            ) : (
              <div className="no-notifications">No notifications</div>
            )}
          </div>
        )}

        {/* Profile Dropdown */}
        <div
          className="profile-menu"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <span className="profile-icon">👤</span>
        </div>
        {showProfileMenu && (
          <div className="profile-dropdown">
            <div onClick={() => navigate("/profile")}>Profile</div>
            <div onClick={() => navigate("/create-account")}>Create Account</div>
            <div onClick={handleLogout}>Logout</div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
