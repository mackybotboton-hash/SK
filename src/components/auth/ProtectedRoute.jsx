import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PermissionGate from './PermissionGate';

/**
 * SKTrack — ProtectedRoute
 * Route wrapper that ensures the user is authenticated and optionally has a specific permission.
 */
export default function ProtectedRoute({ permission }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-body)' }}>
        <div className="spinner-lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to waiting room if account is not yet approved
  if (user?.status === 'pending') {
    return <Navigate to="/pending" replace />;
  }

  // If a permission is required for this route, wrap the Outlet in a PermissionGate
  if (permission) {
    return (
      <PermissionGate permission={permission} fallback={<Navigate to="/" replace />}>
        <Outlet />
      </PermissionGate>
    );
  }

  return <Outlet />;
}
