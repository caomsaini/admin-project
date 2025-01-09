import React from "react";
import ReactDOM from "react-dom/client"; // Update this import
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement); // Use createRoot

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
