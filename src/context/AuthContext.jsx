import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [employee, setEmployee] = useState(() => {
    const stored = localStorage.getItem("employee");
    return stored ? JSON.parse(stored) : null;
  });
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const storedEmployee = localStorage.getItem("employee");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (storedEmployee && tokenExpiry) {
      const now = Date.now();
      if (now > parseInt(tokenExpiry)) {
        logout();
      } else {
        setEmployee(JSON.parse(storedEmployee));
        const timeout = setTimeout(() => {
          logout();
        }, parseInt(tokenExpiry) - now);
        return () => clearTimeout(timeout);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employee");
    localStorage.removeItem("tokenExpiry");
    setEmployee(null);
    setAlertMessage("You have been logged out.");
  };

  return (
    <AuthContext.Provider value={{ employee, setEmployee, alertMessage, setAlertMessage, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);