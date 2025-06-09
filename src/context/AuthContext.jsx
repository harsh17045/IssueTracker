import { createContext, useContext, useState, useEffect } from "react";
import { getMyTickets } from "../services/authService";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [employee, setEmployee] = useState(() => {
    const stored = localStorage.getItem("employee");
    if (stored) {
      const parsedEmployee = JSON.parse(stored);
      // Ensure department data is properly structured
      if (parsedEmployee) {
        return {
          ...parsedEmployee,
          department: parsedEmployee.department ? {
            _id: parsedEmployee.department._id || parsedEmployee.department.id || '',
            name: parsedEmployee.department.name || 'No Department'
          } : { _id: '', name: 'No Department' }
        };
      }
    }
    return null;
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
        const parsedEmployee = JSON.parse(storedEmployee);
        // Ensure department data is properly structured
        const employeeData = {
          ...parsedEmployee,
          department: parsedEmployee.department ? {
            _id: parsedEmployee.department._id || parsedEmployee.department.id || '',
            name: parsedEmployee.department.name || 'No Department'
          } : { _id: '', name: 'No Department' }
        };
        setEmployee(employeeData);
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

