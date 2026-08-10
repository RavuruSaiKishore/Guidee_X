import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";

// ============================================================
// GLOBAL FETCH INTERCEPTOR (Automates CSRF & Credentials)
// ============================================================
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return "";
};

const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
  options = options || {};
  options.headers = options.headers || {};

  // Always send cookies along with requests
  options.credentials = "include";

  const method = (options.method || "GET").toUpperCase();

  // Automatically inject x-csrf-token for state-changing requests
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrfToken = getCookie("csrfToken");
    if (csrfToken) {
      if (options.headers instanceof Headers) {
        options.headers.set("x-csrf-token", csrfToken);
      } else {
        options.headers["x-csrf-token"] = csrfToken;
      }
    }
  }

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
