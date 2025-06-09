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

// Fetch all tickets
export const getAllTickets = async () => {
  try {
    const response = await makeAuthorizedRequest('/get-all-tickets');
    return response.tickets; // Assuming the backend returns { tickets: [...] }
  } catch (error) {
    console.error('Error fetching all tickets:', error);
    throw error;
  }
};

// Fetch all employees
export const getAllEmployees = async () => {
  try {
    const response = await makeAuthorizedRequest('/get-all-employees');
    console.log('All employees:', response);
    return response.employees; // Backend returns { employees: [...] }
  } catch (error) {
    console.error('Error fetching all employees:', error);
    throw error;
  }
};

export const getEmployeeDetails = async (employeeId) => {
  try {
    const response = await makeAuthorizedRequest(`/get-employee-details/${employeeId}`);
    console.log('Employee details:', response);
    
    // Assuming backend returns { employee: {...}, tickets: [...] }
    if (!response.employee) {
      throw new Error('Employee details not found');
    }

    // Combine employee data with tickets for easier access
    return {
      ...response.employee,
      tickets: response.tickets || []
    };
  } catch (error) {
    console.error('Error fetching employee details:', error);
    throw error;
  }
};

export const getAllDepartments = async () => {
  try {
    const response = await makeAuthorizedRequest('/get-departments');
    
    if (!response || !response.depts) {
      throw new Error('Invalid department data received');
    }

    return {
      depts: response.depts
    };
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};


export const addDepartment = async (departmentData) => {
  try {
    const response = await makeAuthorizedRequest('/add-department', {
      method: 'POST',
      body: JSON.stringify(departmentData)
    });
    return response;
  } catch (error) {
    console.error('Error adding department:', error);
    throw error;
  }
};

export const updateDepartment = async (deptId, departmentData) => {
  try {
    const response = await makeAuthorizedRequest(`/update-department/${deptId}`, {
      method: 'PUT',
      body: JSON.stringify(departmentData)
    });
    return response;
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};

export const deleteDepartment = async (deptId) => {
  try {
    const response = await makeAuthorizedRequest(`/delete-department/${deptId}`, {
      method: 'PUT'
    });
    console.log('Department deleted successfully:', response);
    return response;
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};

export const generateTicketReport = async () => {
  try {
    const token = getAdminToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/export-report`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to generate report');
    }

    // Return the blob for PDF download
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};