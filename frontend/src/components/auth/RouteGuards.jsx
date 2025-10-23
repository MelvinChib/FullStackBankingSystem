import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Auth from '../../services/auth';

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const authed = Auth.isAuthenticated();
  
  if (!authed) {
    // Clear any stale data
    Auth.logout();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export const RoleRoute = ({ roles = [], children }) => {
  const location = useLocation();
  const authed = Auth.isAuthenticated();
  if (!authed) return <Navigate to="/login" state={{ from: location }} replace />;
  const session = Auth.getSession();
  const userRoles = session?.user?.roles || [];
  if (roles.length > 0 && !roles.some(r => userRoles.includes(r))) {
    return <Navigate to="/account-dashboard" replace />;
  }
  return children;
};

export const PermissionRoute = ({ permission, children }) => {
  const location = useLocation();
  const authed = Auth.isAuthenticated();
  
  if (!authed) {
    // Clear any stale data
    Auth.logout();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If no permission required, allow access
  if (!permission) {
    return children;
  }
  
  const session = Auth.getSession();
  const perms = session?.user?.permissions || [];
  
  // In demo mode, allow all permissions
  const enableDemo = import.meta?.env?.VITE_ENABLE_DEMO === 'true';
  if (enableDemo || perms.includes(permission)) {
    return children;
  }
  
  // Redirect to login if no permission
  Auth.logout();
  return <Navigate to="/login" replace />;
};

export const PublicOnlyRoute = ({ children }) => {
  const authed = Auth.isAuthenticated();
  if (authed) {
    return <Navigate to="/account-dashboard" replace />;
  }
  return children;
};
