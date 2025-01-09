import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <div className="app">
      <Header />
      <div className="main-container">
        <Sidebar />
        <Dashboard />
      </div>
    </div>
  );
};

export default App;
