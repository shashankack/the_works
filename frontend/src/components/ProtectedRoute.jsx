import { Navigate } from "react-router-dom";
import { isAuthenticated, hasRole } from "../utils/auth";

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  redirectTo = "/login",
  adminRedirectTo = "/admin/login" 
}) => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // If admin role is required, redirect to admin login
    if (requiredRole === "admin") {
      return <Navigate to={adminRedirectTo} replace />;
    }
    // Otherwise redirect to regular login
    return <Navigate to={redirectTo} replace />;
  }

  // If a specific role is required, check if user has it
  if (requiredRole && !hasRole(requiredRole)) {
    // If user is authenticated but doesn't have required role
    if (requiredRole === "admin") {
      return <Navigate to={adminRedirectTo} replace />;
    }
    return <Navigate to={redirectTo} replace />;
  }

  // User is authenticated and has required role (if any)
  return children;
};

export default ProtectedRoute;
