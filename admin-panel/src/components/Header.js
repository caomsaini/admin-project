import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/kaso_white_transparant.png";
import searchIcon from "../assets/search_icon8.png";
import bellIcon from "../assets/bell8-notification.png";
import profileIcon from "../assets/account_icon88.png";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    setLoading(true);
    setProgress(0);
    simulateProgress(() => {
      localStorage.removeItem("token");
      navigate("/Login");
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
    }, 170); // Adjust speed as needed
  };

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const readNotifications = JSON.parse(localStorage.getItem("readNotifications")) || [];
        const updatedNotifications = data.map((notification) => ({
          ...notification,
          read: readNotifications.includes(notification.id),
        }));

        setNotifications(updatedNotifications);
        setUnreadCount(updatedNotifications.filter((n) => !n.read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Handle notification click
  const handleNotificationClick = (index) => {
    const updatedNotifications = [...notifications];
    const notification = updatedNotifications[index];

    if (!notification.read) {
      notification.read = true;
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter((n) => !n.read).length);

      const readNotifications = JSON.parse(localStorage.getItem("readNotifications")) || [];
      localStorage.setItem(
        "readNotifications",
        JSON.stringify([...readNotifications, notification.id])
      );
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Animation CSS class
  const getDropdownClass = (isVisible) => (isVisible ? "slide-down" : "slide-up");

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-logo">
        <img src={logo} alt="Kaso" className="brand-logo" onClick={() => navigate("/")} />
      </div>

      {/* Search Bar */}
      <div className="header-search">
        <input type="text" placeholder="Search..." />
        <button>
          <img src={searchIcon} alt="Search Icon" className="icon" />
        </button>
      </div>

      {/* Icons */}
      <div className="header-icons">
        {/* Notification Bell */}
        <div className="notification-bell" ref={notificationRef}>
          <img
            src={bellIcon}
            alt="Notification Icon"
            className="icon"
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowProfileMenu(false);
            }}
          />
          {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
          <div
            className={`dropdown notifications-dropdown ${getDropdownClass(showNotifications)}`}
          >
            {unreadCount > 0 ? (
              notifications
                .filter((notification) => !notification.read)
                .map((notification, index) => (
                  <div
                    key={notification.id}
                    className="dropdown-item"
                    onClick={() => handleNotificationClick(index)}
                  >
                    {notification.message}
                  </div>
                ))
            ) : (
              <div className="dropdown-empty">No notifications</div>
            )}
          </div>
        </div>

        {/* Profile Menu */}
        <div className="profile-menu" ref={profileRef}>
          <img
            src={profileIcon}
            alt="Profile Icon"
            className="icon"
            onClick={() => {
              setShowProfileMenu((prev) => !prev);
              setShowNotifications(false);
            }}
          />
          <div
            className={`dropdown profile-dropdown ${getDropdownClass(showProfileMenu)}`}
          >
            <div onClick={() => navigate("/profile")}>Profile</div>
            <div onClick={() => navigate("/create-account")}>Create Account</div>
            <div onClick={handleLogout}>Logout</div>
          </div>
        </div>
      </div>

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
    </header>
  );
};

export default Header;
