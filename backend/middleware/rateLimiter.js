// middleware/rateLimiter.js
import rateLimit from "express-rate-limit";

// 1. Strict Limiter for Authentication (Login / Register / Forgot Password)
// Prevents brute-force dictionary attacks (e.g., max 10 attempts per 15 minutes per IP)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message:
      "Too many authentication attempts from this IP, please try again after 15 minutes.",
  },
});

// 2. General API Limiter (Optional for overall API safety against DDoS)
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please slow down.",
  },
});
