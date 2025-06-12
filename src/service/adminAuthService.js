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
    console.log('All tickets:', response);
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
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_URL}/get-departments`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch departments');
    }
    return data;
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

export const getAllBuildings = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('No authentication token found');
    
    const response = await fetch(`${API_URL}/all-buildings`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch buildings');
    return data.buildings || []; // Return the buildings array directly
  } catch (error) {
    console.error('Error fetching buildings:', error);
    throw error;
  }
};

export const addBuilding = async (buildingData) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('No authentication token found');

    console.log('Building data:', buildingData);

    // Format the data to match backend expectations
    const formattedData = {
      name: buildingData.name,
      floors: buildingData.floors.map((floor, index) => ({
        floor: floor.floor,
        labs: Array.isArray(floor.labs) ? floor.labs : floor.labs.split(',').map(lab => lab.trim()).filter(Boolean)
      }))
    };

    const response = await fetch(`${API_URL}/add-building`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formattedData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add building');
    }

    return data;
  } catch (error) {
    console.error('Error adding building:', error);
    throw error;
  }
};

// Departmental Admin Functions
export const getAllDepartmentalAdmins = async () => {
  try {
    const response = await makeAuthorizedRequest('/get-departmental-admins');
    console.log('Departmental admins:', response);

    // Check if response.admin exists and is an array
    if (!response.admin || !Array.isArray(response.admin)) {
      throw new Error('Invalid admin data received');
    }

    // Map the response to match the expected structure
    const formattedAdmins = response.admin.map(admin => ({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      department: {
        _id: admin.department._id,
        name: admin.department.name,
        description: admin.department.description
      },
      isFirstLogin: admin.isFirstLogin,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    }));

    return formattedAdmins;
  } catch (error) {
    console.error('Error fetching departmental admins:', error);
    throw error;
  }
};

export const createDepartmentalAdmin = async (adminData) => {
  try {
    const response = await makeAuthorizedRequest('/create-departmental-admin', {
      method: 'POST',
      body: JSON.stringify(adminData)
    });
    return response;
  } catch (error) {
    console.error('Error creating departmental admin:', error);
    throw error;
  }
};

// export const deleteDepartmentalAdmin = async (adminId) => {
//   try {
//     const response = await makeAuthorizedRequest(`/delete-departmental-admin/${adminId}`, {
//       method: 'DELETE'
//     });
//     return response;
//   } catch (error) {
//     console.error('Error deleting departmental admin:', error);
//     throw error;
//   }
// };


export const getAttachment = async (filename) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('No authentication token found');
    console.log('Fetching attachment for filename:', filename);

    const response = await fetch(`${API_URL}/get-attachment/${filename}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Attachment response:', response);

    if (!response.ok) {
      throw new Error('Failed to fetch attachment');
    }

    return response;
  } catch (error) {
    console.error('Error fetching attachment:', error);
    throw error;
  }
};