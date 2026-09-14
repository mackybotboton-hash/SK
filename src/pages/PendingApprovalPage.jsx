import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { APP_CONFIG } from '../utils/constants';
import { MdHourglassEmpty, MdExitToApp } from 'react-icons/md';

/**
 * PendingApprovalPage — Displayed to users whose account status is 'pending'
 */
export default function PendingApprovalPage() {
  const { logout, user } = useAuth();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', minHeight: '100dvh', background: 'var(--bg-body)' }}>
      <div className="card glass-panel animate-fade-in-up" style={{ maxWidth: '450px', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '50%', 
          background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <MdHourglassEmpty size={40} />
        </div>
        
        <h1 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.75rem' }}>Waiting for Confirmation</h1>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Hi {user?.full_name || 'there'}, your account has been created successfully! 
          However, for security purposes, the Chairperson must manually approve your account and assign your SK Role before you can access the dashboard.
        </p>

        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginBottom: '2.5rem' }}>
          Please check back later or contact the Chairperson directly.
        </p>

        <button 
          className="btn btn-secondary" 
          onClick={() => logout()}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <MdExitToApp size={18} />
          Sign Out for Now
        </button>
      </div>
    </div>
  );
}
