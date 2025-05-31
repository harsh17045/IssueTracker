import { createContext, useContext, useState, useEffect } from "react";
import { getMyTickets } from "../services/authService";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [employee, setEmployee] = useState(() => {
    const stored = localStorage.getItem("employee");
    return stored ? JSON.parse(stored) : null;
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [tickets, setTickets] = useState([]);

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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!employee) return; // Only fetch if authenticated

    const fetchTickets = async () => {
      try {
        const fetchedTickets = await getMyTickets();
        setTickets(fetchedTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        if (employee) {
          toast.error("Failed to fetch tickets");
        }
      }
    };

    fetchTickets();
  }, [employee]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employee");
    localStorage.removeItem("tokenExpiry");
    setEmployee(null);
    setAlertMessage("You have been logged out.");
    toast("Logged out successfully", {
      type: "success",
      autoClose: 3000,
    });
    setTickets([]);
  };

  return (
    <AuthContext.Provider value={{ employee, setEmployee, alertMessage, setAlertMessage, logout, tickets }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

