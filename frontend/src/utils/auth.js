// Token helpers
export const setToken = (accessToken, refreshToken) => {
  const tokenObject = { accessToken, refreshToken };
  localStorage.setItem("token", JSON.stringify(tokenObject));
};

export const getToken = (type = "accessToken") => {
  const raw = localStorage.getItem("token");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed[type] || null;
  } catch (err) {
    return null;
  }
};

export const removeToken = () => localStorage.removeItem("token");

export const isAuthenticated = () => !!getToken("accessToken");

// Role-based auth helpers
export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

export const isAdmin = () => {
  const user = getUser();
  return user?.role === "admin";
};

export const isUser = () => {
  const user = getUser();
  return user?.role === "user";
};

export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  if (requiredRole === "admin") {
    return userRole === "admin";
  }
  if (requiredRole === "user") {
    return userRole === "user" || userRole === "admin"; // Admin can access user routes
  }
  return false;
};

// User helpers
export const setUser = (user) =>
  localStorage.setItem("user", JSON.stringify(user));

export const getUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const removeUser = () => localStorage.removeItem("user");

// Logout helper
export const logout = () => {
  removeToken();
  removeUser();
  window.location.href = "/";
};
