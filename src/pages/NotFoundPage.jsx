import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import { MdErrorOutline } from 'react-icons/md';

export default function NotFoundPage() {
  return (
    <div className="page-enter">
      <PageHeader title="404 Not Found" description="The page you are looking for does not exist." />
      <div className="empty-state">
        <div className="empty-state-icon" style={{ fontSize: '4rem', color: 'var(--danger)', marginBottom: '1rem' }}>
          <MdErrorOutline />
        </div>
        <p className="empty-state-title" style={{ fontSize: '1.5rem', fontWeight: 600 }}>Page Not Found</p>
        <p className="empty-state-desc">Please navigate back to the dashboard.</p>
      </div>
    </div>
  );
}
