import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Orders", path: "/orders" },
    { name: "Products", path: "/products" },
    { name: "Users", path: "/users" },
    { name: "Reports", path: "/reports" },
  ];

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div
        className="sidebar-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? "←" : "→"}
      </div>
      <ul>
        {links.map((link) => (
          <li key={link.name}>
            <NavLink to={link.path} activeClassName="active">
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
