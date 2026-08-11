// src/utils/api.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Centralized request wrapper
export const apiRequest = async (endpoint, options = {}) => {
  const method = (options.method || "GET").toUpperCase();

  // Base headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Optionally attach authorization token if you store it in localStorage
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    method,
    headers,
    credentials: "include", // Ensures cookies (like your auth/JWT cookies) are sent automatically
  });

  const data = await response.json();

  return { res: response, data };
};
