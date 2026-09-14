import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MdDashboard, MdDescription, MdCalendarToday, MdMenu } from 'react-icons/md';
import './BottomNav.css';

/**
 * BottomNav — Persistent bottom tab bar for mobile devices.
 * Shows the 3 most-used destinations + a "More" button that opens the sidebar drawer.
 * Always in the DOM (hidden on desktop via CSS) for instant paint on resize.
 */

const BOTTOM_TABS = [
  { key: 'dashboard', path: '/',          icon: MdDashboard,     label: 'Home',      exact: true },
  { key: 'proposals', path: '/proposals', icon: MdDescription,   label: 'Proposals' },
  { key: 'schedule',  path: '/schedule',  icon: MdCalendarToday, label: 'Schedule' },
];

export default function BottomNav({ onMoreClick }) {
  const location = useLocation();

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <div className="bottom-nav-inner">
        {BOTTOM_TABS.map((tab) => {
          const isActive = tab.exact
            ? location.pathname === tab.path
            : location.pathname.startsWith(tab.path);
          const Icon = tab.icon;

          return (
            <NavLink
              key={tab.key}
              to={tab.path}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="bottom-nav-icon"><Icon size={22} /></span>
              <span className="bottom-nav-label">{tab.label}</span>
            </NavLink>
          );
        })}

        {/* "More" button opens the sidebar drawer */}
        <button
          className="bottom-nav-item"
          onClick={onMoreClick}
          aria-label="Open navigation menu"
        >
          <span className="bottom-nav-icon"><MdMenu size={22} /></span>
          <span className="bottom-nav-label">More</span>
        </button>
      </div>
    </nav>
  );
}
