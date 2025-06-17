const API_URL ='http://localhost:5000/api/dept-admin';

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
    console.log('Requesting login for:', email);
    console.log('API URL:', `${API_URL}/login-request`);
    console.log('Request body:', { email, password });

    const response = await fetch(`${API_URL}/login-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Login request response data:', data);
    
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