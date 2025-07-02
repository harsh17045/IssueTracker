import { createContext, useContext, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useDeptAuth } from "./DeptAuthContext";
import { useNotifications } from "./NotificationContext";
import notificationSound from "../utils/notificationSound";
import { toast } from "react-toastify";

const DeptSocketContext = createContext();

export const DeptSocketProvider = ({ children }) => {
  const { deptAdmin } = useDeptAuth();
  const { addNotification } = useNotifications();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!deptAdmin || !deptAdmin.department) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io("http://localhost:5000", {
      transports: ["polling", "websocket"],
      withCredentials: true,
      timeout: 20000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      // Join rooms logic (same as in DepartmentDashboard)
      const roomsToJoin = [];
      if (typeof deptAdmin.department === "object" && deptAdmin.department._id) {
        roomsToJoin.push(deptAdmin.department._id.toString());
      }
      const departmentName = typeof deptAdmin.department === "object" ? deptAdmin.department.name : deptAdmin.department;
      if (departmentName) {
        roomsToJoin.push(`department-${departmentName.toLowerCase()}`);
      }
      // Debug log for locations
      console.log("deptAdmin.locations:", deptAdmin.locations);
      if (deptAdmin.isNetworkEngineer && deptAdmin.locations?.length > 0) {
        deptAdmin.locations.forEach((location) => {
          const buildingId = typeof location.building === "object" ? location.building._id : location.building;
          if (buildingId && location.floor !== undefined) {
            roomsToJoin.push(`network-${buildingId}-${location.floor}`);
          }
        });
      }
      console.log("Joining rooms:", roomsToJoin);
      roomsToJoin.forEach((room) => {
        socket.emit("join-room", room);
      });
    });

    // Notification handlers
    socket.on("new-ticket", (data) => {
      console.log("Received new-ticket event:", data);
      notificationSound.play();
      console.log("About to show toast for new ticket");
      toast.info(
        `New ticket: ${data.title} (Priority: ${data.priority})`,
        {
          autoClose: 5000,
          position: "top-right",
        }
      );
      console.log("Toast for new ticket should have shown");
      addNotification({
        type: "new-ticket",
        title: "New Ticket Raised",
        message: `New ticket: ${data.title} (Priority: ${data.priority})`,
        ticketId: data.ticketId,
        priority: data.priority,
        from: data.from,
        raisedAt: data.raisedAt,
      });
    });
    socket.on("new-comment", (data) => {
      console.log("Received new-comment event:", data);
      notificationSound.play();
      console.log("About to show toast for new comment");
      toast.info(
        data.employeeName
          ? `New comment from ${data.employeeName} on: ${data.title}`
          : `New comment on: ${data.title}`,
        {
          autoClose: 5000,
          position: "top-right",
        }
      );
      addNotification({
        type: "new-comment",
        title: "New Comment",
        message: `New comment from ${data.employeeName || "Employee"} on: ${data.title}`,
        ticketId: data.ticketId,
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [deptAdmin]);

  return (
    <DeptSocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </DeptSocketContext.Provider>
  );
};

export const useDeptSocket = () => useContext(DeptSocketContext); 