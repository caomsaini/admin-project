import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // 🟢 Import BrowserRouter
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter> {/* 🟢 Wrap the App in BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
