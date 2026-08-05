import { createContext, useContext, useState } from "react";
import { logout as apiLogout } from "../services/authServices";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem(
        "user",
        JSON.stringify(userData)
    );
  };

  const logout = () => {
    // Clear UI state and inform backend to clear httpOnly cookie
    setUser(null);
    localStorage.removeItem("user");
    try {
      apiLogout();
    } catch (err) {
      // ignore network errors on logout
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}