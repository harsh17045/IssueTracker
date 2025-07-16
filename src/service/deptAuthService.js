const API_URL ='http://localhost:5000/api/dept-admin';

const ALL_STATUSES = ['pending', 'in_progress', 'resolved', 'revoked'];

// Inventory APIs (moved from inventoryService.js)
const DEPT_API_URL = "http://localhost:5000/api/departmental-admin";
const ADMIN_API_URL = "http://localhost:5000/api/admin";

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
  const response = await fetch(`${API_URL}/login-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.message || 'Login request failed'
    };
  }

  return {
    success: true,
    message: data.message || 'OTP sent successfully',
    data: data
  };
};

export const verifyDeptAdminOtp = async (email, otp) => {
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
};

export const changeDeptAdminPassword = async (email, newPassword) => {
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
};

export const getDepartmentTickets = async () => {
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
};

export const getDepartmentAttachment = async (filename) => {
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
};

export const updateTicketStatus = async (ticketId, { status, comment }, attachmentFile) => {
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
};

export const getLoggedInDepartmentalAdmin = async () => {
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
};

export const generateDeptTicketReport = async ({
  startDate,
  endDate,
  status = ["all"],
  includeComments = false
} = {}) => {
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
};

export const exportDeptTicketReportExcel = async ({
  startDate,
  endDate,
  status = ["all"],
  includeComments = false
} = {}) => {
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
  const response = await fetch(`${API_URL}/export-excel?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  if (!response.ok) {
    throw new Error('Failed to generate Excel report');
  }
  // Return the blob for Excel download
  const blob = await response.blob();
  return blob;
};

export const getAssignedTickets = async () => {
  const token = getDeptAdminToken();
  if (!token) {
    return {
      success: false,
      message: 'Authentication token not found'
    };
  }
  const response = await fetch(`${API_URL}/get-assigned-tickets`, {
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
      message: data.message || 'Failed to fetch assigned tickets'
    };
  }
  return {
    success: true,
    tickets: data.tickets,
    message: 'Assigned tickets fetched successfully'
  };
};

export const markTicketAsViewed = async (ticketId) => {
  const token = getDeptAdminToken()
  if (!token) {
    return {
      success: false,
      message: "Authentication token not found",
    }
  }

  const response = await fetch(`${API_URL}/mark-viewed/${ticketId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    return {
      success: false,
      message: data.message || "Failed to mark ticket as viewed",
    }
  }

  return {
    success: true,
    message: "Ticket marked as viewed successfully",
    lastViewedAt: data.last_viewed_at,
  }
};

export const getUnreadTicketUpdates = async () => {
  const token = getDeptAdminToken()
  if (!token) {
    return {
      success: false,
      message: "Authentication token not found",
    }
  }

  const response = await fetch(`${API_URL}/unread-updates`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    return {
      success: false,
      message: data.message || "Failed to fetch unread updates",
    }
  }

  return {
    success: true,
    updatedTickets: data.updatedTickets || [],
    totalUpdatedTickets: data.totalUpdatedTickets || 0,
    message: "Unread updates fetched successfully",
  }
};

export const getAllInventorySystems = async () => {
  const response = await fetch(`${API_URL}/get-inventory`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getDeptAdminToken()}`,
    },
  })
  const data = await response.json()
  return data.systems;
};

export const addInventorySystem = async (system) => {
  console.log("system",system)
  const response = await fetch(`${API_URL}/add-inventory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getDeptAdminToken()}`,
    },
    body: JSON.stringify(system),
  })
  const data = await response.json()
  console.log(data)
  return data;
};

export const updateInventorySystem = async (id, updates) => {
  const response = await fetch(`${API_URL}/update-inventory/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getDeptAdminToken()}`,
    },
    body: JSON.stringify(updates),
  })
  const data = await response.json()
  console.log(data)
  return data.system;
};

export const getAllComponentSets = async () => {
  const response = await fetch(`${API_URL}/get-componentset`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getDeptAdminToken()}`,
    },
  })
  const data = await response.json()
  console.log('[getAllComponentSets] Response:', data)
  return data.sets || [];
};

export const getAllBuildingsForAdminIT = async () => {
  const token = getDeptAdminToken();
  try {
    const res = await fetch(`${API_URL}/all-buildings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        },
    });
    const data = await res.json();
    if (res.ok && Array.isArray(data.buildings)) {
      return data.buildings;
    }
    return [];
  } catch {
    return [];
  }
};

export const exportDeptInventoryExcel = async ({
  building = '',
  floor = '',
  labNumber = '',
  systemType = ''
} = {}) => {
  const token = getDeptAdminToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  // Build query string
  const params = new URLSearchParams();
  if (building) params.append('building', building);
  if (floor) params.append('floor', floor);
  if (labNumber) params.append('labNumber', labNumber);
  if (systemType) params.append('systemType', systemType);
  const response = await fetch(`${API_URL}/export-inventory-excel?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  if (!response.ok) {
    throw new Error('Failed to generate Inventory Excel report');
  }
  // Return the blob for Excel download
  const blob = await response.blob();
  return blob;
};

export const exportDeptInventoryReportExcel = async ({
  building = '',
  floor = '',
  labNumber = '',
  systemType = ''
} = {}) => {
  const token = getDeptAdminToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  // Build query string
  const params = new URLSearchParams();
  if (building) params.append('building', building);
  if (floor) params.append('floor', floor);
  if (labNumber) params.append('labNumber', labNumber);
  if (systemType) params.append('systemType', systemType);
  const response = await fetch(`${API_URL}/export-inventory-excel?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  if (!response.ok) {
    throw new Error('Failed to generate Inventory Excel report');
  }
  // Return the blob for Excel download
  const blob = await response.blob();
  return blob;
};

export const bulkUpdateInventoryLocation = async (systemIds, buildingName, floor, labNumber) => {
  const token = getDeptAdminToken();
  if (!token) {
    return {
      success: false,
      message: 'Authentication token not found'
    };
  }

  const response = await fetch(`${API_URL}/bulk-update-location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      systemIds,
      buildingName,
      floor,
      labNumber
    })
  });

  const data = await response.json();
  if (!response.ok) {
    return {
      success: false,
      message: data.message || 'Failed to bulk update inventory locations'
    };
  }

  return {
    success: true,
    message: data.message || 'Inventory locations updated successfully',
    data: data
  };
};

export const bulkDeleteInventorySystems = async (ids) => {
  const token = getDeptAdminToken();
  if (!token) {
    return {
      success: false,
      message: 'Authentication token not found'
    };
  }

  const response = await fetch(`${API_URL}/delete-system`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ ids })
  });

  const data = await response.json();
  if (!response.ok) {
    return {
      success: false,
      message: data.message || 'Failed to delete inventory system(s)'
    };
  }

  return {
    success: true,
    message: data.message || 'Inventory system(s) deleted successfully',
    data: data
  };
};

