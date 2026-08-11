import { createContext, useEffect, useState } from "react";

import {
  createToken,
  decodeToken,
  isTokenExpired,
} from "../utils/tokenUtils";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      if (isTokenExpired(savedToken)) {
        refreshToken(savedToken);
      } else {
        const decodedUser = decodeToken(savedToken);

        setUser(decodedUser);
        setToken(savedToken);
      }
    }

    setLoading(false);
  }, []);

  const login = (username, password, role) => {
    const newToken = createToken(username, role);

    const decodedUser = decodeToken(newToken);

    localStorage.setItem("token", newToken);

    setToken(newToken);
    setUser(decodedUser);

    return true;
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  };

  const refreshToken = (oldToken) => {
    try {
      const oldUser = decodeToken(oldToken);

      const newToken = createToken(
        oldUser.username,
        oldUser.role
      );

      const decodedUser = decodeToken(newToken);

      localStorage.setItem("token", newToken);

      setToken(newToken);
      setUser(decodedUser);

      return newToken;
    } catch (error) {
      logout();

      return null;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}