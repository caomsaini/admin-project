import React from 'react';
import Header from "./components/Header";
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Users from './pages/Users';
import Reports from './pages/Reports';
import "./styles/Header.css";
import "./styles/Sidebar.css";
import "./styles/App.css";

function App() {
  return (
    <div className="app-container">
      
      <Sidebar />
      <Header />
      <div className="content">
        <Routes> {/* 🟢 Added Routes here */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products" element={<Products />} />
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
