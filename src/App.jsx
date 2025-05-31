//import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/authPage';
import { AdminAuthProvider } from './context/AdminAuthContext'; // Ensure this is imported
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <AdminAuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Navigate to="/admin-login" replace />} />
          <Route path="/admin-login" element={<AuthPage />} />
          <Route path="/dept-login" element={<AuthPage />} />
        </Routes>
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
          theme="light"
        />
      </Router>
    </AdminAuthProvider>
  );
};

export default App;