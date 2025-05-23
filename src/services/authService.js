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
