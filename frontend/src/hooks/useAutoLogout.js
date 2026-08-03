import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const useAutoLogout = (timeout = 15 * 60 * 1000) => {
  const { token, user, logout } = useAuth();

  const navigate = useNavigate();

  const timerRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const autoLogout = async () => {
      await logout();

      toast.error("Session expired. Please login again.");

      switch (user?.role) {
        case "admin":
          navigate("/login", { replace: true });
          break;

        case "mentor":
          navigate("/login", { replace: true });
          break;

        default:
          navigate("/login", { replace: true });
      }
    };

    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(autoLogout, timeout);
    };

    const events = [
      "click",
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [token, user, logout, navigate, timeout]);
};

export default useAutoLogout;
