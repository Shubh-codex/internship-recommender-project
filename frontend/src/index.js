import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";

// Create root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app inside BrowserRouter for routing
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CssBaseline />  {/* Ensures proper styling for dark/light themes */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
