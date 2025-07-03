const API_URL ='http://localhost:5000/api/dept-admin';

const ALL_STATUSES = ['pending', 'in_progress', 'resolved', 'revoked'];

export const getDeptAdminToken = () => {
  return localStorage.getItem('deptAdminToken');
};

export const getDeptAdminData = () => {
  const data = localStorage.getItem('deptAdminData');
  return data ? JSON.parse(data) : null;
};

export const setDeptAdminToken = (token) => {
  localStorage.setItem('deptAdminToken', token);
};

export const setDeptAdminData = (data) => {
  localStorage.setItem('deptAdminData', JSON.stringify(data));
};

export const deptAdminLoginRequest = async (email, password) => {
  try {

    const response = await fetch(`${API_URL}/login-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    
    
    const data = await response.json();

    if (!response.ok) {
      console.log('Login request failed:', data);
      return {
        success: false,
        message: data.message || 'Login request failed'
      };
    }

    console.log('Login request successful:', data);
    return {
      success: true,
      message: data.message || 'OTP sent successfully',
      data: data
    };
  } catch (error) {
    console.error('Error in deptAdminLoginRequest:', error);
    return {
      success: false,
      message: error.message || 'Login request failed'
    };
  }
};

export const verifyDeptAdminOtp = async (email, otp) => {
  try {
    const response = await fetch(`${API_URL}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'OTP verification failed'
      };
    }

    // Store token and data
    setDeptAdminToken(data.token);
    setDeptAdminData(data.admin);

    return {
      success: true,
      token: data.token,
      deptAdmin: data.admin,
      message: 'OTP verified successfully'
    };
  } catch (error) {
    console.error('Error in verifyDeptAdminOtp:', error);
    return {
      success: false,
      message: error.message || 'OTP verification failed'
    };
  }
};

export const changeDeptAdminPassword = async (email, newPassword) => {
  try {
    const token = getDeptAdminToken();
    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found'
      };
    }

    const response = await fetch(`${API_URL}/change-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email, newPassword })
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to change password'
      };
    }
    return {
      success: true,
      message: 'Password changed successfully'
    };
  } catch (error) {
    console.error('Error in changeDeptAdminPassword:', error);
    return {
      success: false,
      message: error.message || 'Failed to change password'
    };
  }
};

export const getDepartmentTickets = async () => {
  try {
    const token = getDeptAdminToken();
    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found'
      };
    }

    const response = await fetch(`${API_URL}/get-tickets`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to fetch tickets'
      };
    }
    
    return {
      success: true,
      tickets: data.tickets,
      message: 'Tickets fetched successfully'
    };
  } catch (error) {
    console.error('Error in getDepartmentTickets:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch tickets'
    };
  }
};

export const getDepartmentAttachment = async (filename) => {
  try {
    const token = getDeptAdminToken();
    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found'
      };
    }

    const response = await fetch(`${API_URL}/get-attachment/${filename}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to fetch attachment'
      };
    }

    return {
      success: true,
      data: response,
      message: 'Attachment fetched successfully'
    };
  } catch (error) {
    console.error('Error in getDepartmentAttachment:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch attachment'
    };
  }
};

export const updateTicketStatus = async (ticketId, { status, comment }, attachmentFile) => {
  try {
    const token = getDeptAdminToken();
    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found'
      };
    }
    let response, data;
    if (attachmentFile) {
      const formData = new FormData();
      if (status) formData.append('status', status);
      if (comment) formData.append('comment', comment);
      formData.append('attachment', attachmentFile);
      response = await fetch(`${API_URL}/update-ticket/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
    } else {
      response = await fetch(`${API_URL}/update-ticket/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, comment })
      });
    }
    data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to update ticket status'
      };
    }
    return {
      success: true,
      ticket: data.ticket,
      message: data.message || 'Ticket updated successfully'
    };
  } catch (error) {
    console.error('Error in updateTicketStatus:', error);
    return {
      success: false,
      message: error.message || 'Failed to update ticket status'
    };
  }
};

export const getLoggedInDepartmentalAdmin = async () => {
  try {
    const token = getDeptAdminToken();
    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found'
      };
    }
    const response = await fetch(`${API_URL}/my-data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to fetch departmental admin data'
      };
    }
    return {
      success: true,
      data: data,
      message: 'Departmental admin data fetched successfully'
    };
  } catch (error) {
    console.error('Error in getLoggedInDepartmentalAdmin:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch departmental admin data'
    };
  }
};

export const generateDeptTicketReport = async ({
  startDate,
  endDate,
  status = ["all"],
  includeComments = false
} = {}) => {
  try {
    const token = getDeptAdminToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    // Build query string
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    let statusToSend = status;
    if (Array.isArray(status) && status.length === 1 && status[0] === 'all') {
      statusToSend = ALL_STATUSES;
    }
    if (statusToSend && Array.isArray(statusToSend)) {
      params.append('status', statusToSend.join(','));
    } else if (statusToSend) {
      params.append('status', statusToSend);
    }
    params.append('includeComments', includeComments ? 'true' : 'false');
    const response = await fetch(`${API_URL}/export-pdf?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    if (!response.ok) {
      throw new Error('Failed to generate PDF report');
    }
    // Return the blob for PDF download
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
};

export const exportDeptTicketReportExcel = async ({
  startDate,
  endDate,
  status = ["all"],
  includeComments = false
} = {}) => {
  try {
    const token = getDeptAdminToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    // Build query string
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    let statusToSend = status;
    if (Array.isArray(status) && status.length === 1 && status[0] === 'all') {
      statusToSend = ALL_STATUSES;
    }
    if (statusToSend && Array.isArray(statusToSend)) {
      params.append('status', statusToSend.join(','));
    } else if (statusToSend) {
      params.append('status', statusToSend);
    }
    params.append('includeComments', includeComments ? 'true' : 'false');
    console.log(params.toString());
    const response = await fetch(`${API_URL}/export-excel?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    console.log(response);
    if (!response.ok) {
      throw new Error('Failed to generate Excel report');
    }
    // Return the blob for Excel download
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error generating Excel report:', error);
    throw error;
  }
};