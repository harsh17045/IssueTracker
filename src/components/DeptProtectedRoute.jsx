import { Navigate } from 'react-router-dom';
import { useDeptAuth } from '../context/DeptAuthContext';

const DeptProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useDeptAuth();
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/dept-login" replace />;
  }

  return children;
};

export default DeptProtectedRoute; 