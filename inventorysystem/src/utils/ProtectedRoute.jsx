import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRoutes }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  // If no token, redirect to login
  if (!token) {
    toast.error("You must be logged in to access this page.");
    return <Navigate to="/RiderLogin" />;
  }

  // Check if the user is a rider and tries to access admin routes
  if (role === '0' && allowedRoutes.includes("/AddRiders")) {
    toast.error("You do not have permission to access admin routes.");
    return <Navigate to="/WelcomeRider" />;
  }

  // Check if the user is an admin and tries to access rider routes
  if (role === '1' && allowedRoutes.includes("/WelcomeRider")) {
    toast.error("You do not have permission to access rider routes.");
    return <Navigate to="/AddRiders" />;
  }

  // Helper function to match routes
  const isAllowedRoute = (pathname) => {
    return allowedRoutes.some((route) => pathname.startsWith(route));
  };

  // If the route is not allowed, redirect to the appropriate page
  if (!isAllowedRoute(location.pathname)) {
    toast.error("You do not have permission to access this page.");
    return role === "1" ? <Navigate to="/AddRiders" /> : <Navigate to="/WelcomeRider" />;
  }

  return children;
};

export default ProtectedRoute;
