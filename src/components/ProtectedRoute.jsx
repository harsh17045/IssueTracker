import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { employee } = useAuth();
  console.log("Protected Route - Employee:", employee); // Add this log

  if (!employee) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;