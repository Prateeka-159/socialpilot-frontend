import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, logout as apiLogout } from "../services/authServices";
import { getProfile } from "../services/profileService";
import { getToken, normalizeRole, removeToken } from "../services/api";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const data = await getProfile();

    setUser({
      ...data.user,
      role: normalizeRole(data.user.role),
    });
  };

  useEffect(() => {
    const initAuth = async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        await loadUser();
      } catch {
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    await apiLogin(email, password);
    await loadUser();
    return true;
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
