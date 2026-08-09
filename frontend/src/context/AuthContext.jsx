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
        endpoint = `${API_BASE_URL}/api/user/userProfile`;
        break;

      default:
        setUser(null);
        setLoading(false);
        return;
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
          alert("Session expired because you logged in from another device."); // Or use a toast library if preferred
        }
        logout();
        return;
      }

      if (!res.ok || !data.success) {
        console.error(data);
        setLoading(false);
        return;
      }

      // Set the correct user object
      switch (role) {
        case "admin":
          setUser(data.admin);
          break;

        case "mentor":
          setUser(data.mentor);
          break;

        case "student":
          setUser(data.user);
          break;
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

    switch (userData.role) {
      case "admin":
        localStorage.setItem("AdminToken", jwtToken);
        break;

      case "mentor":
        localStorage.setItem("MentorToken", jwtToken);
        break;

      default:
        localStorage.setItem("UserToken", jwtToken);
    }

    setToken(jwtToken);
    setUser(userData);
    setLoading(false);
  };

  // ================= LOGOUT =================

  const logout = () => {
    localStorage.removeItem("UserToken");
    localStorage.removeItem("MentorToken");
    localStorage.removeItem("AdminToken");

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
