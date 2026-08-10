// middleware/csrfMiddleware.js
import crypto from "crypto";

// 1. Middleware to generate and attach a CSRF token cookie on GET requests
export const setCsrfTokenCookie = (req, res, next) => {
  let csrfToken = req.cookies.csrfToken;

  if (!csrfToken) {
    csrfToken = crypto.randomBytes(32).toString("hex");
    res.cookie("csrfToken", csrfToken, {
      httpOnly: false, // Must be readable by frontend JS so it can attach it to headers
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
  }

  next();
};

// 2. Middleware to verify the CSRF token on state-changing requests
export const verifyCsrfToken = (req, res, next) => {
  // Skip verification for safe methods
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  const cookieToken = req.cookies.csrfToken;
  const headerToken = req.headers["x-csrf-token"];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      success: false,
      message: "Invalid or missing CSRF token. Request blocked.",
    });
  }

  next();
};
