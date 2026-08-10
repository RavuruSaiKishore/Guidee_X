
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("google-button-div"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }, [GOOGLE_CLIENT_ID]);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  return <div id="google-button-div" className="flex justify-center w-full my-2"></div>;
}