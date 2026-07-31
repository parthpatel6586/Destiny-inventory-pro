import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user, token]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const cleanUsername = username.trim();
      
      // Support specified custom credentials: ParthPatel@gmail.com / Parth123
      if (
        (cleanUsername.toLowerCase() === "parthpatel@gmail.com" || cleanUsername === "ParthPatel@gmail.com") &&
        password === "Parth123"
      ) {
        // Try posting to DummyJSON auth endpoint if needed, or build matching Auth payload
        let userData = {
          id: 99,
          username: "ParthPatel@gmail.com",
          email: "ParthPatel@gmail.com",
          firstName: "Parth",
          lastName: "Patel",
          gender: "male",
          image: "https://dummyjson.com/icon/emilys/128",
          token: "dummyjson_jwt_token_parth_patel_2026",
        };

        // Try dummyjson auth fetch to be authentic with DummyJSON API
        try {
          const response = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: cleanUsername,
              password: password,
              expiresInMins: 60,
            }),
          });
          if (response.ok) {
            const data = await response.json();
            userData = data;
          }
        } catch (e) {
          console.warn("DummyJSON API unreachable, using dummyjson auth response fallback.", e);
        }

        setUser(userData);
        setToken(userData.token || "dummyjson_jwt_token_parth_patel_2026");
        setLoading(false);
        return { success: true, user: userData };
      }

      // Fallback: Try DummyJSON API for standard accounts (e.g. emilys / emilyspass)
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cleanUsername,
          password: password,
          expiresInMins: 60,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        setUser(data);
        setToken(data.token);
        setLoading(false);
        return { success: true, user: data };
      } else {
        setLoading(false);
        return {
          success: false,
          message: data.message || "Invalid username or password. Please use ParthPatel@gmail.com and password Parth123.",
        };
      }
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.message || "Network error while connecting to auth API.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
