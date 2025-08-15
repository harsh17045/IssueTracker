import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { getMyTickets } from "../services/authService";
import { toast } from "react-toastify";
import io from "socket.io-client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [employee, setEmployee] = useState(() => {
    const stored = localStorage.getItem("employee");
    if (stored) {
      const parsedEmployee = JSON.parse(stored);
      if (parsedEmployee) {
        return {
          ...parsedEmployee,
          id: parsedEmployee._id || parsedEmployee.id,
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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  
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

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return {e};
    }
  }

  // --- SOCKET.IO for real-time ticket status updates ---
  const handleStatusUpdate = useCallback((data, connectionId = "?") => {
    toast.info(`Ticket '${data.title}' status updated to '${data.status}'`, {
      autoClose: 5000,
      position: "top-right",
    });
    setNotifications(prev => [
      {
        id: Date.now(),
        type: "status-update",
        title: "Ticket Status Updated",
        message: `Your ticket '${data.title}' status changed to '${data.status}'`,
        ticketId: data.ticketId,
        status: data.status,
        updatedAt: data.updatedAt,
        read: false,
      },
      ...prev
    ]);
    setUnreadCount(prev => prev + 1);
    (async () => {
      try {
        const fetchedTickets = await getMyTickets();
        setTickets(fetchedTickets);
      } catch (error) {
        toast.error("Failed to update tickets after status change",error);
      }
    })();
  }, [setNotifications, setUnreadCount, setTickets]);

  useEffect(() => {
    const connectionId = Math.random().toString(36).substr(2, 5);
    let employeeId = employee?.id || employee?._id;
    if (!employeeId) {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = parseJwt(token);
        employeeId = payload.id || payload._id || payload.userId;
      }
    }
    if (!employeeId) {
      console.log(`[Socket][${connectionId}] No employeeId, skipping socket connection.`);
      return;
    }

    // Clean up previous socket
    if (socketRef.current) {
      
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io(import.meta.env.VITE_API_URL, {
      transports: ["polling", "websocket"],
      withCredentials: true,
      timeout: 20000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      const roomName = `employee-${employeeId}`;
      socket.emit("join-room", roomName);
    });

    socket.on("room-joined", () => {
      
    });

    socket.on("disconnect", () => {
    
    });

    socket.on("ticket-status-updated", handleStatusUpdateWithId);

    socket.on("new-comment", (data) => {
      toast.info(
        data.from === "departmental-admin"
          ? `Admin commented on your ticket: ${data.title}`
          : `New comment on your ticket: ${data.title}`,
        {
          autoClose: 5000,
          position: "top-right",
        }
      );
      setNotifications(prev => [
        {
          id: Date.now(),
          type: "new-comment",
          title: "New Comment",
          message:
            data.from === "departmental-admin"
              ? `Admin commented: ${data.comment.text}`
              : `New comment: ${data.comment.text}`,
          ticketId: data.ticketId,
          read: false,
        },
        ...prev,
      ]);
      setUnreadCount(prev => prev + 1);
    });

    function handleStatusUpdateWithId(data) {
      handleStatusUpdate(data, connectionId);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("ticket-status-updated", handleStatusUpdateWithId);
        socketRef.current.off("new-comment");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [employee, handleStatusUpdate]);

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

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
    setNotifications([]);
    setUnreadCount(0);
    // Clean up socket
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  return (
    <AuthContext.Provider value={{ employee, setEmployee, alertMessage, setAlertMessage, logout, tickets, notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead, clearNotification }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

