const API_URL = "http://localhost:5000/api/admin";

export const adminLogin = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token and admin info
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminInfo', JSON.stringify(data.admin));

    return data;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

export const adminLogout = () => {
  try {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

export const getAdminInfo = () => {
  const adminInfo = localStorage.getItem('adminInfo');
  return adminInfo ? JSON.parse(adminInfo) : null;
};

// Protected API calls using admin token
export const makeAuthorizedRequest = async (endpoint, options = {}) => {
  const token = getAdminToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};