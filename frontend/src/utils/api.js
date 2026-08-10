// src/utils/api.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Helper function to read the cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return "";
};

// Centralized request wrapper
export const apiRequest = async (endpoint, options = {}) => {
  const method = (options.method || "GET").toUpperCase();

  // Base headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Automatically attach CSRF token for state-changing methods
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrfToken = getCookie("csrfToken");
    if (csrfToken) {
      headers["x-csrf-token"] = csrfToken;
    }
  }

  // Optionally attach authorization token if you store it in localStorage
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    method,
    headers,
    credentials: "include", // Ensures cookies (JWT & CSRF) are sent automatically
  });

  const data = await response.json();

  return { res: response, data };
};
