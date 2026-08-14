import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "react-toastify/dist/ReactToastify.css";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
    }
  }, [GOOGLE_CLIENT_ID]);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Google authentication failed");
      }

      login(data.token, data.user);
      toast.success("Google sign-in successful!");

      setTimeout(() => {
        navigate(data.redirectTo || "/", { replace: true });
      }, 500);
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      toast.error(err.message || "Failed to sign in with Google");
    }
  };

  const handleCustomGoogleClick = () => {
    if (window.google) {
      google.accounts.id.prompt(); // Triggers the One Tap / Google Popup flow
    }
  };

  return (
    <button
      type="button"
      onClick={handleCustomGoogleClick}
      className="w-full h-12 sm:h-14 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-600 transition-all duration-200 flex items-center justify-center gap-3 text-slate-700 shadow-2xs"
      style={{
        fontFamily: "'Source Sans Pro', Arial, sans-serif",
        fontStyle: "normal",
        fontWeight: 600,
      }}
    >
      {/* Google G SVG Icon */}
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
      </svg>
      <span className="text-xs sm:text-sm">Continue with Google</span>
    </button>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // ============================================================
  // STATES
  // ============================================================

  const [mode, setMode] = useState("login");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [otp, setOtp] = useState("");
  const [resetOtp, setResetOtp] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Lockout & Attempts States
  const [lockUntil, setLockUntil] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(null);

  // ============================================================
  // COUNTDOWN EFFECT FOR LOCKOUT
  // ============================================================

  useEffect(() => {
    if (!lockUntil) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(lockUntil) - new Date()) / 1000)
      );
      setCountdown(remaining);

      if (remaining <= 0) {
        setLockUntil(null);
        setAttemptsRemaining(null);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockUntil]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // ============================================================
  // FORM INPUT
  // ============================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // REGISTER
  // ============================================================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim()) {
      return toast.error("Please enter your first name");
    }

    if (!formData.lastName.trim()) {
      return toast.error("Please enter your last name");
    }

    if (!formData.email.trim()) {
      return toast.error("Please enter your email");
    }

    if (!formData.password) {
      return toast.error("Please enter a password");
    }

    if (formData.password.length < 6) {
      return toast.error("Password must contain at least 6 characters");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("OTP sent to your email!");

      setMode("otp");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // VERIFY OTP
  // ============================================================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      return toast.error("Please enter a valid 6-digit OTP");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Invalid OTP");
        return;
      }

      toast.success("Account created successfully!");

      setOtp("");

      setMode("login");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOGIN
  // ============================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (lockUntil !== null) {
      return toast.error("Account is temporarily locked. Please wait.");
    }

    if (!formData.email.trim()) {
      return toast.error("Please enter your email");
    }

    if (!formData.password) {
      return toast.error("Please enter your password");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      // Handle account locked response (HTTP 423)
      if (res.status === 423) {
        setLockUntil(data.lockUntil);
        setAttemptsRemaining(null);
        return;
      }

      // Handle invalid credentials response
      if (!res.ok) {
        setAttemptsRemaining((prev) => {
          if (data.attemptsRemaining !== undefined) {
            return data.attemptsRemaining;
          }
          return prev === null ? 4 : Math.max(0, prev - 1);
        });
        return;
      }

      // Successful login - Reset tracking states
      setAttemptsRemaining(null);
      setLockUntil(null);

      login(data.token, data.user);

      toast.success("Login successful!");

      setTimeout(() => {
        navigate(data.redirectTo || "/", { replace: true });
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error("Unable to login");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FORGOT PASSWORD
  // ============================================================

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail.trim()) {
      return toast.error("Please enter your email");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resetEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Unable to send OTP");
        return;
      }

      toast.success("OTP sent to your email!");

      setMode("reset");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RESET PASSWORD
  // ============================================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!resetOtp) {
      return toast.error("Please enter OTP");
    }

    if (resetOtp.length !== 6) {
      return toast.error("OTP must be 6 digits");
    }

    if (!newPassword) {
      return toast.error("Please enter new password");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must contain at least 6 characters");
    }

    if (newPassword !== confirmNewPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resetEmail,
          otp: resetOtp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Unable to reset password");
        return;
      }

      toast.success("Password reset successfully!");

      setResetOtp("");
      setNewPassword("");
      setConfirmNewPassword("");

      setMode("login");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // COMMON INPUT CLASS
  // ============================================================

  const inputClass =
    "w-full h-12 sm:h-14 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm";

  // ============================================================
  // CHANGE MODE
  // ============================================================

  const changeMode = (newMode) => {
    setMode(newMode);

    setOtp("");
    setResetOtp("");
  };

  return (
    <div
      className="min-h-screen mt-16 sm:mt-20 bg-slate-50 flex items-center justify-center p-3 sm:p-6 lg:p-8"
      style={{
        fontFamily: "'Source Sans Pro', Arial, sans-serif",
        fontStyle: "normal",
        fontWeight: 600,
      }}
    >
      <ToastContainer position="top-right" autoClose={2500} newestOnTop />

      <div className="w-full max-w-[1400px] min-h-[650px] bg-white rounded-2xl sm:rounded-3xl shadow-xs border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
        {/* ======================================================
            LEFT SIDE
        ====================================================== */}

        <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-black text-white p-8 sm:p-12 flex-col justify-between">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-blue-400/10 blur-2xl" />

          {/* Logo */}

          <div className="relative z-10 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl border border-white/15 bg-white/10 backdrop-blur flex items-center justify-center text-blue-400 shadow-inner">
              <GraduationCap size={24} />
            </div>

            <div>
              <h1
                className="text-2xl sm:text-3xl font-semibold tracking-tight text-white"
                style={{ fontWeight: 600 }}
              >
                Guide<span className="text-blue-400">X</span>
              </h1>

              <p
                className="text-[10px] uppercase tracking-wider text-slate-400"
                style={{ fontWeight: 600 }}
              >
                Learn • Connect • Grow
              </p>
            </div>
          </div>

          {/* Content */}

          <div className="relative z-10 space-y-4">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/15 bg-white/10 text-xs text-blue-300 backdrop-blur"
              style={{ fontWeight: 600 }}
            >
              <Sparkles size={14} className="text-blue-400" />
              Your journey starts here
            </div>

            <h2
              className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight"
              style={{ fontWeight: 600 }}
            >
              Learn from
              <br />
              <span className="text-blue-400">those who know.</span>
            </h2>

            <p
              className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md font-medium"
              style={{ fontWeight: 600 }}
            >
              Connect with experienced mentors, build meaningful skills, and
              take your career to the next level with GuideX.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "Connect with industry mentors",
                "Build real-world skills",
                "Grow your professional network",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200"
                  style={{ fontWeight: 600 }}
                >
                  <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative z-10 flex items-center gap-2 text-xs text-slate-400 font-medium"
            style={{ fontWeight: 600 }}
          >
            <ShieldCheck size={16} className="text-blue-400" />
            Secure and trusted learning platform
          </div>
        </div>

        {/* ======================================================
            RIGHT SIDE
        ====================================================== */}

        <div className="w-full lg:w-[52%] flex items-center justify-center p-4 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}

            <div className="lg:hidden text-center mb-6">
              <div className="inline-flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-blue-400 border border-white/15">
                  <GraduationCap size={22} />
                </div>

                <h1
                  className="text-xl font-semibold text-slate-900"
                  style={{ fontWeight: 600 }}
                >
                  Guide<span className="text-blue-600">X</span>
                </h1>
              </div>
            </div>

            {/* ==================================================
                LOGIN
            ================================================== */}

            {mode === "login" && (
              <div>
                <div className="mb-6">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-blue-700 mb-2"
                    style={{ fontWeight: 600 }}
                  >
                    WELCOME BACK
                  </span>

                  <h2
                    className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900"
                    style={{ fontWeight: 600 }}
                  >
                    Welcome back!
                  </h2>

                  <p
                    className="text-slate-500 text-xs sm:text-sm font-medium mt-1"
                    style={{ fontWeight: 600 }}
                  >
                    Sign in to continue your GuideX journey.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* LOCKOUT WARNING BANNER */}
                  {lockUntil !== null && (
                    <div
                      className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center font-semibold animate-pulse"
                      style={{ fontWeight: 600 }}
                    >
                      Account locked due to multiple failed attempts. Try again
                      in{" "}
                      <span className="font-bold underline">
                        {formatTime(countdown)}
                      </span>
                      .
                    </div>
                  )}

                  {/* REMAINING ATTEMPTS BANNER */}
                  {lockUntil === null && attemptsRemaining !== null && (
                    <div
                      className="p-3 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl flex items-center gap-2"
                      style={{ fontWeight: 600 }}
                    >
                      <AlertCircle
                        size={15}
                        className="shrink-0 text-amber-600"
                      />
                      <span>
                        Invalid credentials. You have{" "}
                        <strong>{attemptsRemaining}</strong> attempt(s)
                        remaining before lockout.
                      </span>
                    </div>
                  )}

                  {/* EMAIL */}

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      disabled={lockUntil !== null}
                      style={{ fontWeight: 600 }}
                      className={`${inputClass} pl-11 disabled:bg-slate-100 disabled:cursor-not-allowed`}
                    />
                  </div>

                  {/* PASSWORD */}

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      disabled={lockUntil !== null}
                      style={{ fontWeight: 600 }}
                      className={`${inputClass} pl-11 pr-11 disabled:bg-slate-100 disabled:cursor-not-allowed`}
                    />

                    <button
                      type="button"
                      disabled={lockUntil !== null}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => changeMode("forgot")}
                      className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline"
                      style={{ fontWeight: 600 }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || lockUntil !== null}
                    style={{ fontWeight: 600 }}
                    className="w-full h-12 sm:h-14 rounded-xl bg-black hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? "Signing in..."
                      : lockUntil !== null
                      ? `Locked (${formatTime(countdown)})`
                      : "Sign In"}

                    {!loading && lockUntil === null && (
                      <ArrowRight size={16} className="text-blue-400" />
                    )}
                  </button>
                </form>

                {/* GOOGLE SIGN IN BUTTON SECTION */}
                <div className="mt-4">
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span
                        className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider font-semibold"
                        style={{ fontWeight: 600 }}
                      >
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <GoogleLoginButton />
                </div>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>

                  <div className="relative flex justify-center">
                    <span
                      className="bg-white px-3 text-xs text-slate-400 font-medium"
                      style={{ fontWeight: 600 }}
                    >
                      New to GuideX?
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => changeMode("register")}
                  style={{ fontWeight: 600 }}
                  className="w-full h-12 sm:h-14 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 transition shadow-2xs"
                >
                  Create an Account
                </button>
              </div>
            )}

            {/* ==================================================
                REGISTER
            ================================================== */}

            {mode === "register" && (
              <div>
                <button
                  type="button"
                  onClick={() => changeMode("login")}
                  style={{ fontWeight: 600 }}
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 mb-5 font-semibold"
                >
                  <ArrowLeft size={15} />
                  Back to login
                </button>

                <h2
                  className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900"
                  style={{ fontWeight: 600 }}
                >
                  Create your account
                </h2>

                <p
                  className="text-slate-500 text-xs sm:text-sm font-medium mt-1 mb-5"
                  style={{ fontWeight: 600 }}
                >
                  Join GuideX and start learning from experts.
                </p>

                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First name"
                      style={{ fontWeight: 600 }}
                      className={inputClass}
                    />

                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last name"
                      style={{ fontWeight: 600 }}
                      className={inputClass}
                    />
                  </div>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    style={{ fontWeight: 600 }}
                    className={inputClass}
                  />

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create password"
                      style={{ fontWeight: 600 }}
                      className={`${inputClass} pr-11`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      style={{ fontWeight: 600 }}
                      className={`${inputClass} pr-11`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ fontWeight: 600 }}
                    className="w-full h-12 sm:h-14 rounded-xl bg-black hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition shadow-xs disabled:opacity-50 mt-1"
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </button>
                </form>

                <p
                  className="text-center text-xs text-slate-500 font-medium mt-5"
                  style={{ fontWeight: 600 }}
                >
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => changeMode("login")}
                    style={{ fontWeight: 600 }}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}

            {/* ==================================================
                OTP
            ================================================== */}

            {mode === "otp" && (
              <div>
                <button
                  type="button"
                  onClick={() => changeMode("register")}
                  style={{ fontWeight: 600 }}
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 mb-6 font-semibold"
                >
                  <ArrowLeft size={15} />
                  Back
                </button>

                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4">
                    <Mail size={28} />
                  </div>

                  <h2
                    className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900"
                    style={{ fontWeight: 600 }}
                  >
                    Verify your email
                  </h2>

                  <p
                    className="text-slate-500 text-xs sm:text-sm font-medium mt-1"
                    style={{ fontWeight: 600 }}
                  >
                    Enter the 6-digit OTP sent to
                  </p>

                  <p
                    className="font-semibold text-slate-800 text-xs sm:text-sm mt-1 break-all"
                    style={{ fontWeight: 600 }}
                  >
                    {formData.email}
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    style={{ fontWeight: 600 }}
                    className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50 text-center text-xl font-semibold tracking-[0.4em] outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 text-slate-800"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ fontWeight: 600 }}
                    className="w-full h-12 sm:h-14 rounded-xl bg-black hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition shadow-xs disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify Account"}
                  </button>
                </form>
              </div>
            )}

            {/* ==================================================
                FORGOT PASSWORD
            ================================================== */}

            {mode === "forgot" && (
              <div>
                <button
                  type="button"
                  onClick={() => changeMode("login")}
                  style={{ fontWeight: 600 }}
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 mb-6 font-semibold"
                >
                  <ArrowLeft size={15} />
                  Back to login
                </button>

                <div className="mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4">
                    <Lock size={24} />
                  </div>

                  <h2
                    className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900"
                    style={{ fontWeight: 600 }}
                  >
                    Forgot your password?
                  </h2>

                  <p
                    className="text-slate-500 text-xs sm:text-sm font-medium mt-1"
                    style={{ fontWeight: 600 }}
                  >
                    Enter your email address and we'll send you an OTP.
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    style={{ fontWeight: 600 }}
                    className={inputClass}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ fontWeight: 600 }}
                    className="w-full h-12 sm:h-14 rounded-xl bg-black hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition shadow-xs disabled:opacity-50"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              </div>
            )}

            {/* ==================================================
                RESET PASSWORD
            ================================================== */}

            {mode === "reset" && (
              <div>
                <button
                  type="button"
                  onClick={() => changeMode("forgot")}
                  style={{ fontWeight: 600 }}
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 mb-6 font-semibold"
                >
                  <ArrowLeft size={15} />
                  Back
                </button>

                <div className="mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <ShieldCheck size={26} />
                  </div>

                  <h2
                    className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900"
                    style={{ fontWeight: 600 }}
                  >
                    Reset your password
                  </h2>

                  <p
                    className="text-slate-500 text-xs sm:text-sm font-medium mt-1"
                    style={{ fontWeight: 600 }}
                  >
                    Enter the OTP and create your new password.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-3.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={resetOtp}
                    onChange={(e) =>
                      setResetOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    style={{ fontWeight: 600 }}
                    className={`${inputClass} text-center font-semibold tracking-[0.3em]`}
                  />

                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      style={{ fontWeight: 600 }}
                      className={`${inputClass} pr-11`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                      style={{ fontWeight: 600 }}
                      className={`${inputClass} pr-11`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmNewPassword(!showConfirmNewPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                    >
                      {showConfirmNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ fontWeight: 600 }}
                    className="w-full h-12 sm:h-14 rounded-xl bg-black hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition shadow-xs disabled:opacity-50 mt-1"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              </div>
            )}

            <p
              className="text-center text-[11px] text-slate-400 font-medium mt-8"
              style={{ fontWeight: 600 }}
            >
              © {new Date().getFullYear()} GuideX. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
