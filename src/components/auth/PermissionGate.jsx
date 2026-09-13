import React from 'react';
import { useAuth } from '../../hooks/useAuth';

/**
 * SKTrack — PermissionGate
 * Renders children only if the current user has the specified permission.
 */
export default function PermissionGate({ permission, children, fallback = null }) {
  const { hasPermission } = useAuth();
  
  if (hasPermission(permission)) {
    return <>{children}</>;
  }
  
  return fallback;
}
