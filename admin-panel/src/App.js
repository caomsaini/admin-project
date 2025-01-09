import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import LoginPage from './pages/LoginPage';
import Analytics from './pages/Analytics';

function App() {
  return (
    <div>
      <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/Login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </div>
  );
}

export default App;