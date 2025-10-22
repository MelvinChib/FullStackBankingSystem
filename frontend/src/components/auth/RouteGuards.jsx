import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Auth from '../../services/auth';

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const authed = Auth.isAuthenticated();
  if (!authed) {
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
  if (!authed) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!permission) return children;
  const session = Auth.getSession();
  const perms = session?.user?.permissions || [];
  if (!perms.includes(permission)) {
    return <Navigate to="/account-dashboard" replace />;
  }
  return children;
};

export const PublicOnlyRoute = ({ children }) => {
  const authed = Auth.isAuthenticated();
  if (authed) {
    return <Navigate to="/account-dashboard" replace />;
  }
  return children;
};
