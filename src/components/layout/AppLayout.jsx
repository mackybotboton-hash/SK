import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

/**
 * AppLayout — Main application shell.
 * Wraps Sidebar + TopBar + content area.
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
    </div>
  );
}
