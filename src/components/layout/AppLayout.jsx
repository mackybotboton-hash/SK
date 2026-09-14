import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

/**
 * AppLayout — Main application shell.
 * Wraps Sidebar + TopBar + BottomNav + content area.
 * Uses React Router's <Outlet /> for nested page rendering.
 */
export default function AppLayout({ onLogout, pageTitle }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Auto close mobile sidebar on route/page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('body-scroll-locked');
    } else {
      document.body.classList.remove('body-scroll-locked');
    }
    return () => {
      document.body.classList.remove('body-scroll-locked');
    };
  }, [mobileMenuOpen]);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onToggle={handleToggleSidebar}
        onMobileClose={() => setMobileMenuOpen(false)}
        onLogout={onLogout}
      />

      <div className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <TopBar
          onMenuToggle={handleMobileMenuToggle}
          pageTitle={pageTitle}
        />

        <main className="app-content page-enter">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Persistent bottom tab bar (mobile only, hidden on desktop via CSS) */}
      <BottomNav onMoreClick={handleMobileMenuToggle} />
    </div>
  );
}
