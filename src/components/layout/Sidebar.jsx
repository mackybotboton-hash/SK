import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  MdDashboard, MdFolder, MdDescription, MdAccountBalance,
  MdReceipt, MdAttachFile, MdCalendarToday, MdAssessment,
  MdHistory, MdPeople, MdChevronLeft, MdChevronRight, MdLogout, MdWeb
} from 'react-icons/md';
import RoleManager from '../../auth/RoleManager';
import { NAV_ITEMS, APP_CONFIG } from '../../utils/constants';
import './Sidebar.css';

// Icon map for dynamic rendering
const ICON_MAP = {
  MdDashboard, MdFolder, MdDescription, MdAccountBalance,
  MdReceipt, MdAttachFile, MdCalendarToday, MdAssessment,
  MdHistory, MdPeople, MdWeb
};

/**
 * Sidebar — Main navigation sidebar component.
 * Collapsible, animated, with role-based menu filtering.
 */
export default function Sidebar({ collapsed, mobileOpen, onToggle, onMobileClose, onLogout }) {
  const location = useLocation();
  const roleManager = RoleManager.getInstance();

  // Filter nav items based on user permissions
  const visibleItems = NAV_ITEMS.filter((item) => {
    return roleManager.hasPermission(item.permission);
  });

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <img src="/logo.png" alt="SK Diatagon Logo" className="sidebar-logo-img" />
        </div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <span className="sidebar-app-name">{APP_CONFIG.APP_NAME}</span>
            <span className="sidebar-app-tagline">Barangay Diatagon</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {visibleItems.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

            return (
              <li key={item.key}>
                <NavLink
                  to={item.path}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  title={collapsed ? item.label : undefined}
                  onClick={() => {
                    if (onMobileClose) onMobileClose();
                  }}
                >
                  <span className="sidebar-link-icon">
                    {Icon && <Icon size={20} />}
                  </span>
                  {!collapsed && (
                    <span className="sidebar-link-label">{item.label}</span>
                  )}
                  {isActive && <span className="sidebar-link-indicator" />}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button
          className="sidebar-link sidebar-logout"
          onClick={onLogout}
          title={collapsed ? 'Logout' : undefined}
        >
          <span className="sidebar-link-icon">
            <MdLogout size={20} />
          </span>
          {!collapsed && <span className="sidebar-link-label">Logout</span>}
        </button>

        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <MdChevronRight size={18} /> : <MdChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
