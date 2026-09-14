import React from 'react';
import { MdMenu, MdNotifications, MdSearch, MdPerson } from 'react-icons/md';
import RoleManager from '../../auth/RoleManager';
import { ROLE_LABELS } from '../../utils/constants';
import { getInitials } from '../../utils/formatters';
import './TopBar.css';

/**
 * TopBar — Top navigation bar with search, notifications, and user info.
 */
export default function TopBar({ onMenuToggle, pageTitle }) {
  const roleManager = RoleManager.getInstance();
  const user = roleManager.currentUser;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn show-mobile-only" onClick={onMenuToggle}>
          <MdMenu size={24} />
        </button>

        {pageTitle && <h1 className="topbar-title">{pageTitle}</h1>}
      </div>

      <div className="topbar-right">
        {/* Search */}
        <div className="topbar-search hide-mobile">
          <MdSearch size={18} className="topbar-search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="topbar-search-input"
          />
        </div>

        {/* Notifications */}
        <button className="topbar-icon-btn" title="Notifications">
          <MdNotifications size={20} />
          <span className="topbar-notification-dot" />
        </button>

        {/* User */}
        <div className="topbar-user" style={{ cursor: 'pointer' }}>
          <div className="avatar avatar-sm" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
            <MdPerson size={20} />
          </div>
          <div className="topbar-user-info hide-mobile">
            <span className="topbar-user-name">Profile</span>
          </div>
        </div>
      </div>
    </header>
  );
}
