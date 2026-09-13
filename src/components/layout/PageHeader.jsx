import React from 'react';

/**
 * PageHeader — Reusable page header with title, description, and action buttons.
 */
export default function PageHeader({ title, description, children }) {
  return (
    <div className="page-header animate-fade-in">
      <div className="page-header-info">
        <h1 className="heading-page">{title}</h1>
        {description && <p className="text-body">{description}</p>}
      </div>
      {children && (
        <div className="page-header-actions">
          {children}
        </div>
      )}
    </div>
  );
}
