// src/context/AuthContext.jsx
import { createContext, useEffect, useState, useCallback } from "react";
import { loginUser, registerUser } from "../api/auth";
import { decodeJwt } from "../utils/jwt";

export const AuthContext = createContext(null);

function userFromToken(access) {
  const claims = decodeJwt(access);
  if (!claims) return null;
  return {
    id: claims.user_id,
    email: claims.email,
    username: claims.username,
    role: claims.role,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("accessToken");
    return token ? userFromToken(token) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const persistSession = (access) => {
    localStorage.setItem("accessToken", access);
    const parsed = userFromToken(access);
    setUser(parsed);
    return parsed;
  };

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const { data } = await loginUser(credentials);
      return persistSession(data.access);
    } finally {
      setLoading(false);
    }
  }, []);

  const adminLogin = login;

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      await registerUser(payload);
      const { data } = await loginUser({ email: payload.email, password: payload.password });
      return persistSession(data.access);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, adminLogin, register, logout, isAdmin, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}