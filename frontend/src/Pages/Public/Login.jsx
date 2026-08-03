import React, { useState } from "react";
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
} from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "react-toastify/dist/ReactToastify.css";

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

      if (!res.ok) {
        toast.error(data.message || "Invalid email or password");
        return;
      }

      login(data.token, data.user);

      toast.success("Login successful!");

      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin", { replace: true });
        } else if (data.user.role === "mentor") {
          navigate("/mentor", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
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
    "w-full h-14 px-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  // ============================================================
  // CHANGE MODE
  // ============================================================

  const changeMode = (newMode) => {
    setMode(newMode);

    setOtp("");
    setResetOtp("");
  };

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 md:p-8">
      <ToastContainer position="top-right" autoClose={2500} newestOnTop />

      <div className="w-full max-w-6xl min-h-[680px] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* ======================================================
            LEFT SIDE
        ====================================================== */}

        <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 text-white p-12 flex-col justify-between">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10" />

          <div className="absolute -bottom-40 -left-32 w-[500px] h-[500px] rounded-full bg-white/5" />

          {/* Logo */}

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center">
              <GraduationCap size={34} />
            </div>

            <div>
              <h1 className="text-4xl font-black">
                Guide<span className="text-blue-200">X</span>
              </h1>

              <p className="text-xs uppercase tracking-[0.3em] text-blue-100">
                Learn • Connect • Grow
              </p>
            </div>
          </div>

          {/* Content */}

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm mb-6">
              <Sparkles size={16} />
              Your journey starts here
            </div>

            <h2 className="text-5xl font-black leading-tight">
              Learn from
              <br />
              <span className="text-blue-200">those who know.</span>
            </h2>

            <p className="mt-6 text-blue-100 text-lg leading-relaxed max-w-md">
              Connect with experienced mentors, build meaningful skills, and
              take your career to the next level with GuideX.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Connect with industry mentors",
                "Build real-world skills",
                "Grow your professional network",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={20} />

                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-sm text-blue-200">
            <ShieldCheck size={18} />
            Secure and trusted learning platform
          </div>
        </div>

        {/* ======================================================
            RIGHT SIDE
        ====================================================== */}

        <div className="w-full lg:w-[52%] flex items-center justify-center p-6 sm:p-10 md:p-14">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}

            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white">
                  <GraduationCap size={26} />
                </div>

                <h1 className="text-3xl font-black">
                  Guide<span className="text-blue-600">X</span>
                </h1>
              </div>
            </div>

            {/* ==================================================
                LOGIN
            ================================================== */}

            {mode === "login" && (
              <div>
                <div className="mb-8">
                  <p className="text-sm font-semibold text-blue-600 mb-2">
                    WELCOME BACK
                  </p>

                  <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                    Welcome back!
                  </h2>

                  <p className="text-gray-500 mt-3">
                    Sign in to continue your GuideX journey.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  {/* EMAIL */}

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className={`${inputClass} pl-12`}
                    />
                  </div>

                  {/* PASSWORD */}

                  <div className="relative">
                    <Lock
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className={`${inputClass} pl-12 pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => changeMode("forgot")}
                      className="text-sm font-semibold text-blue-600"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center gap-3 disabled:opacity-60"
                  >
                    {loading ? "Signing in..." : "Sign In"}

                    {!loading && <ArrowRight size={19} />}
                  </button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>

                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-gray-400">
                      New to GuideX?
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => changeMode("register")}
                  className="w-full h-14 rounded-2xl border-2 border-gray-200 font-bold hover:border-blue-500 hover:text-blue-600 transition"
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
                  className="flex items-center gap-2 text-sm text-gray-500 mb-7"
                >
                  <ArrowLeft size={17} />
                  Back to login
                </button>

                <h2 className="text-3xl font-black">Create your account</h2>

                <p className="text-gray-500 mt-2 mb-7">
                  Join GuideX and start learning from experts.
                </p>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First name"
                      className={inputClass}
                    />

                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last name"
                      className={inputClass}
                    />
                  </div>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    className={inputClass}
                  />

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create password"
                      className={`${inputClass} pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className={`${inputClass} pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold disabled:opacity-60"
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => changeMode("login")}
                    className="font-bold text-blue-600"
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
                  className="flex items-center gap-2 text-sm text-gray-500 mb-8"
                >
                  <ArrowLeft size={17} />
                  Back
                </button>

                <div className="text-center">
                  <div className="mx-auto w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                    <Mail size={34} />
                  </div>

                  <h2 className="text-3xl font-black">Verify your email</h2>

                  <p className="text-gray-500 mt-3">
                    Enter the 6-digit OTP sent to
                  </p>

                  <p className="font-bold mt-2 break-all">{formData.email}</p>
                </div>

                <form onSubmit={handleVerifyOtp} className="mt-8 space-y-5">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full h-16 rounded-2xl border-2 border-gray-200 bg-gray-50 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold disabled:opacity-60"
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
                  className="flex items-center gap-2 text-sm text-gray-500 mb-8"
                >
                  <ArrowLeft size={17} />
                  Back to login
                </button>

                <div className="mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                    <Lock size={28} />
                  </div>

                  <h2 className="text-3xl font-black">Forgot your password?</h2>

                  <p className="text-gray-500 mt-3">
                    Enter your email address and we'll send you an OTP.
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={inputClass}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold disabled:opacity-60"
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
                  className="flex items-center gap-2 text-sm text-gray-500 mb-8"
                >
                  <ArrowLeft size={17} />
                  Back
                </button>

                <div className="mb-7">
                  <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6">
                    <ShieldCheck size={30} />
                  </div>

                  <h2 className="text-3xl font-black">Reset your password</h2>

                  <p className="text-gray-500 mt-3">
                    Enter the OTP and create your new password.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={resetOtp}
                    onChange={(e) =>
                      setResetOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className={`${inputClass} text-center font-bold tracking-[0.4em]`}
                  />

                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className={`${inputClass} pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showNewPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className={`${inputClass} pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmNewPassword(!showConfirmNewPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmNewPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold disabled:opacity-60"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              </div>
            )}

            <p className="text-center text-xs text-gray-400 mt-8">
              © {new Date().getFullYear()} GuideX. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
