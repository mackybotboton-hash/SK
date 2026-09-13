import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import useUsers from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { MdSearch, MdPeople, MdShield, MdBlock, MdCheckCircle, MdPersonAdd, MdHourglassEmpty } from 'react-icons/md';
import { ROLES, ROLE_LABELS } from '../utils/constants';

export default function UserManagementPage() {
  const { users, loading, updateUserRole, updateUserStatus } = useUsers();
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  if (!hasPermission('manage:users')) {
    return (
      <div className="page-enter">
        <PageHeader title="Access Denied" />
        <div className="alert alert-error">You do not have permission to view or manage users.</div>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    (u.full_name && u.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page-enter">
      <PageHeader title="User Management" description="Manage SK officials, access levels, and account status" />

      <div className="card glass-panel" style={{ marginBottom: '1.5rem', padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '400px' }}>
          <MdSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} size={20} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search users by name or email..." 
            style={{ paddingLeft: '2.5rem', width: '100%' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => {
            alert('To add an official, please ask them to visit the login page and click "Sign Up" to create their account. Once they register, they will appear here where you can assign them their specific SK Role (Treasurer, Secretary, etc.).');
          }}
        >
          <MdPersonAdd size={20} />
          <span>Add Official</span>
        </button>
      </div>

      <div className="card glass-panel" style={{ overflowX: 'auto' }}>
        {loading && users.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner-lg" style={{ margin: '0 auto' }} /></div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}><MdPeople /></div>
            <p className="empty-state-title" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>No users found</p>
          </div>
        ) : (
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>User</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Email</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Role</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isSelf = user?.id === u.id;
                
                return (
                  <tr key={u.id} className="hover-lift" style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {u.full_name ? u.full_name.charAt(0).toUpperCase() : '?'}
                        </div>
                        {u.full_name} {isSelf && <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>(You)</span>}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <select 
                        className="form-control" 
                        value={u.role} 
                        onChange={(e) => updateUserRole(u.id, e.target.value)}
                        disabled={isSelf || loading}
                        style={{ padding: '0.25rem 0.5rem', width: 'auto' }}
                      >
                        {Object.values(ROLES).map(role => (
                          <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                        padding: '0.25rem 0.5rem', borderRadius: '4px',
                        background: u.status === 'active' ? 'var(--success-bg, rgba(46,204,113,0.1))' : 
                                    u.status === 'pending' ? 'var(--warning-bg, rgba(245,158,11,0.1))' : 
                                    'var(--danger-bg, rgba(231,76,60,0.1))',
                        color: u.status === 'active' ? 'var(--success)' : 
                               u.status === 'pending' ? 'var(--warning)' : 
                               'var(--danger)',
                        fontSize: '0.875rem', fontWeight: 600, textTransform: 'capitalize'
                      }}>
                        {u.status === 'active' ? <MdCheckCircle /> : u.status === 'pending' ? <MdHourglassEmpty /> : <MdBlock />} {u.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {u.status === 'pending' ? (
                          <button 
                            className="btn btn-primary" 
                            onClick={() => updateUserStatus(u.id, 'active')}
                            disabled={isSelf || loading}
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                          >
                            Approve
                          </button>
                        ) : (
                          <button 
                            className="btn btn-secondary" 
                            style={{ 
                              color: u.status === 'active' ? 'var(--danger)' : 'var(--success)', 
                              borderColor: u.status === 'active' ? 'var(--danger)' : 'var(--success)',
                              padding: '0.25rem 0.75rem', fontSize: '0.875rem'
                            }}
                            onClick={() => updateUserStatus(u.id, u.status === 'active' ? 'suspended' : 'active')}
                            disabled={isSelf || loading}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
