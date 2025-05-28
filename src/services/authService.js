const API_URL = "http://localhost:5000/api/employees";

export const registerNewUser = async (userData) => {
  console.log("User data in authService:", userData);
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const newresponse = await response.json();
  console.log("Response:", newresponse);
  return newresponse;
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
    // Store token and employee data in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("employee", JSON.stringify(data.employee));
    localStorage.setItem("tokenExpiry", Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  }

  return data;
};

export const raiseTicket = async (ticketData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/raise-ticket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ticketData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create ticket");
    }

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    console.error("Ticket creation error:", error); // Add error logging
    throw error;
  }
};

export const getMyTickets = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/my-tickets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch tickets");
    }

    return data.tickets;
  } catch (error) {
    console.error("Error fetching tickets:", error);
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

export const updateProfile = async (profileData) => {
  try {
    console.log("Profile data in authService:", profileData);

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    console.log("Response status:", response.status);

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile");
    }

    return data.employee;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    console.log("Password data in authService:", passwordData);
    const token = localStorage.getItem("token");
    console.log("Token in authService:", token);
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
