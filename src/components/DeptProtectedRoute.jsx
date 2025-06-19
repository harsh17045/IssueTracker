import { Navigate } from 'react-router-dom';
import { useDeptAuth } from '../context/DeptAuthContext';

const DeptProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useDeptAuth();

  console.log('DeptProtectedRoute rendered');
  console.log('isAuthenticated:', isAuthenticated);
  console.log('loading:', loading);

  if (loading) {
    console.log('DeptProtectedRoute: showing loading');
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  if (!isAuthenticated) {
    console.log('DeptProtectedRoute: not authenticated, redirecting to login');
    return <Navigate to="/dept-login" replace />;
  }

  console.log('DeptProtectedRoute: authenticated, rendering children');
  return children;
};

export default DeptProtectedRoute; 