import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";

// ============================================================
// GLOBAL FETCH INTERCEPTOR (Automates Credentials)
// ============================================================
const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
  options = options || {};
  options.headers = options.headers || {};

  // Always send cookies along with requests
  options.credentials = "include";

  return originalFetch(url, options);
};

// ============================================================
// REACT APP RENDERING
// ============================================================
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <ToastContainer position="top-right" />
    </AuthProvider>
  </BrowserRouter>
);
