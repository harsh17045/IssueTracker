import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/authPage';
import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import AdminDashboard from './components/AdminDashboard'; // Import the new dashboard
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Employee from './pages/Employee';
import EmployeeDetail from './pages/EmployeeDetail';
import Tickets from './pages/Tickets'; 
import Departments from './pages/Departments';
import Reports from './pages/Reports';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <AdminAuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark" // Changed to dark theme to match the design
        />
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Navigate to="/admin-login" replace />} />
          <Route path="/admin-login" element={<AuthPage />} />
          <Route path="/dept-login" element={<AuthPage />} />

          {/* Protected Admin Dashboard Route */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <div className="flex h-screen bg-[#0B1426]"> {/* Updated background color */}
                  <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                  <div className="flex-1 flex flex-col">
                    <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                    <main className="flex-1 overflow-y-auto">
                      <AdminDashboard /> {/* Use the new dashboard component */}
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/admin/employee" element={<Employee />} />
          <Route path="/admin/tickets" element={<Tickets />} />
          <Route path="/admin/employee/:id" element={<EmployeeDetail />} />
          <Route path="/admin/departments" element={<Departments />} />
          <Route path="/admin/reports" element={<Reports />} />
        </Routes>
      </AdminAuthProvider>
    </Router>
  );
};

export default App;