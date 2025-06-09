const API_URL = "http://localhost:5000/api/employees";

export const registerNewUser = async (userData) => {
  console.log("User data in authService:", userData);
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const newResponse = await response.json();
    console.log("Response:", newResponse);

    if (!response.ok) {
      throw new Error(newResponse.message || "Registration failed");
    }

    return newResponse;
  } catch (error) {
    console.error("Error in registerNewUser:", error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  console.log("User data in authService:", userData);
  const response = await fetch(`${API_URL}/login-request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response;
};

export const verifyUser = async (userData) => {
  console.log("User data in authService:", userData);
  const response = await fetch(`${API_URL}/verify-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();

  if (data.token && data.employee) {
    // Calculate midnight IST
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset from UTC (5 hours 30 minutes)
    const utcMidnight = new Date(now);
    utcMidnight.setHours(24, 0, 0, 0); // Set to next midnight UTC
    const istMidnight = new Date(utcMidnight.getTime() + istOffset); // Convert to IST

    // Store token and employee data in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("employee", JSON.stringify(data.employee));
    localStorage.setItem("tokenExpiry", istMidnight.getTime().toString());
  }

  return data;
};

export const raiseTicket = async (ticketData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/raise-ticket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...ticketData,
        status: 'pending' // Ensure new tickets start as pending
      }),
    });

    const data = await response.json();
    console.log("Ticket creation response:", data);
    console.log("Ticket creation response status:", response);
    if (!response.ok) {
      throw new Error(data.message || "Failed to create ticket");
    }

    console.log("Ticket created successfully:", data);

    return data;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

export const getMyTickets = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/my-tickets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch tickets');
    }

    // Check if data is an array or has a tickets property
    const tickets = Array.isArray(data) ? data : data.tickets || [];
    
    // Transform tickets to ensure consistent structure
    return tickets.map(ticket => ({
      _id: ticket._id,
      title: ticket.title || '',
      description: ticket.description || '',
      status: ticket.status || 'pending', // Default to pending for new tickets
      to_department: ticket.to_department || { id: '', name: 'Unknown Department' },
      createdAt: ticket.createdAt || new Date().toISOString()
    }));

  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/get-profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch profile");
    }

    return data.employee;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfile = async (profileData, isMultipart = false) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (isMultipart) {
      // For FormData (with file upload), don't set Content-Type
      // Let browser set it automatically with boundary
      options.body = profileData;
    } else {
      // For JSON data (without file upload)
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(profileData);
    }

    console.log("Sending profile data:", isMultipart ? "FormData" : profileData);

    const response = await fetch(`${API_URL}/update-profile`, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.employee;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to change password");
    }

    return data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

export const requestPasswordResetOtp = async (email) => {
  try {
    const response = await fetch(`${API_URL}/forgot-pass-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send reset OTP');
    }

    return data;
  } catch (error) {
    console.error('Request password reset error:', error);
    throw error;
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/verify-forgot-pass-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        otp: otp,
        newPassword: newPassword
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset password');
    }

    return data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

export const updateTicket = async (ticketId, updateData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/update-ticket/${ticketId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: updateData.title,
        description: updateData.description,
        to_department: updateData.to_department
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update ticket");
    }

    return data.ticket;
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
};

export const getAllDepartments = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/all-departments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch departments');
    }

    const data = await response.json();
    return data.depts;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

export const revokeTicket = async (ticketId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/revoke-ticket/${ticketId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'revoked' }) // Explicitly set status to revoked
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to revoke ticket");
    }

    return data;
  } catch (error) {
    console.error("Error revoking ticket:", error);
    throw error;
  }
};

export const filterTickets = async (filters) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Build query string from filters
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.to_department) queryParams.append('to_department', filters.to_department);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);

    const response = await fetch(`${API_URL}/filter-tickets?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch filtered tickets');
    }

    return data.tickets;
  } catch (error) {
    console.error('Error filtering tickets:', error);
    throw error;
  }
};

export const getAllBuildings = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/all-buildings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // Add auth token
      }
    });

    console.log('Buildings API Response:', response); // Debug log

    if (!response.ok) {
      throw new Error('Failed to fetch buildings');
    }

    const data = await response.json();
    if (!data.buildings || !Array.isArray(data.buildings)) {
      throw new Error('Invalid building data received');
    }

    return data.buildings;
  } catch (error) {
    console.error('Error fetching buildings:', error);
    throw error;
  }
};