import { createContext, useContext, useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const AuthContext = createContext();

// ================= GET TOKEN =================

const getToken = () => {
  if (localStorage.getItem("AdminToken")) {
    return {
      token: localStorage.getItem("AdminToken"),
      role: "admin",
    };
  }

  if (localStorage.getItem("MentorToken")) {
    return {
      token: localStorage.getItem("MentorToken"),
      role: "mentor",
    };
  }

  if (localStorage.getItem("UserToken")) {
    return {
      token: localStorage.getItem("UserToken"),
      role: "student",
    };
  }

  // Fallback for general / Google token storage
  if (localStorage.getItem("Token")) {
    return {
      token: localStorage.getItem("Token"),
      role: "student", // Will be verified/adjusted upon profile fetch if needed
    };
  }

  return {
    token: null,
    role: null,
  };
};

export const AuthProvider = ({ children }) => {
  const auth = getToken();

  const [token, setToken] = useState(auth.token);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH USER =================

  const fetchUser = async () => {
    const { token: storedToken, role } = getToken();

    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    let endpoint = "";

    switch (role) {
      case "admin":
        endpoint = `${API_BASE_URL}/api/admin/profile`;
        break;

      case "mentor":
        endpoint = `${API_BASE_URL}/api/mentor/profile`;
        break;

      case "student":
      default:
        endpoint = `${API_BASE_URL}/api/user/userProfile`;
        break;
    }

    try {
      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
        cache: "no-store",
      });

      const data = await res.json();

      // Catch session expiration from another device
      if (res.status === 401) {
        if (data.sessionExpired) {
          alert("Session expired because you logged in from another device.");
        }
        logout();
        return;
      }

      if (!res.ok || !data.success) {
        console.error(data);
        setLoading(false);
        return;
      }

      // Set the correct user object based on role or response structure
      if (data.admin) {
        setUser(data.admin);
      } else if (data.mentor) {
        setUser(data.mentor);
      } else {
        setUser(data.user || data);
      }

      setToken(storedToken);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN =================

  const login = (jwtToken, userData) => {
    localStorage.removeItem("UserToken");
    localStorage.removeItem("MentorToken");
    localStorage.removeItem("AdminToken");
    localStorage.removeItem("Token");

    const userRole = userData?.role || "student";

    if (userRole === "admin") {
      localStorage.setItem("AdminToken", jwtToken);
    } else if (userRole === "mentor") {
      localStorage.setItem("MentorToken", jwtToken);
    } else {
      localStorage.setItem("UserToken", jwtToken);
    }

    // Also store general token for seamless compatibility
    localStorage.setItem("Token", jwtToken);

    setToken(jwtToken);
    setUser(userData);
    setLoading(false);
  };

  // ================= LOGOUT =================

  const logout = () => {
    localStorage.removeItem("UserToken");
    localStorage.removeItem("MentorToken");
    localStorage.removeItem("AdminToken");
    localStorage.removeItem("Token");

    setUser(null);
    setToken(null);
    setLoading(false);
  };

  // ================= INITIAL LOAD & BACKGROUND HEARTBEAT =================

  useEffect(() => {
    fetchUser();

    // Optional Heartbeat: Checks session validity every 30 seconds automatically
    const interval = setInterval(() => {
      const { token: currentToken } = getToken();
      if (currentToken) {
        fetchUser();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        fetchUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
