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

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
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
          onClick={() => {
            alert('To add an official, please ask them to visit the login page and click "Sign Up" to create their account. Once they register, they will appear here where you can assign them their specific SK Role (Treasurer, Secretary, etc.).');
          }}
        >
          <MdPersonAdd size={20} /> Add Official
        </button>
      </div>

      <div className="data-table-wrapper">
        {loading && users.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner-lg" style={{ margin: '0 auto' }} /></div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-muted)' }}><MdPeople /></div>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>No users found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isSelf = user?.id === u.id;
                
                return (
                  <tr key={u.id}>
                    <td data-label="User" style={{ fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary-600)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {u.full_name ? u.full_name.charAt(0).toUpperCase() : '?'}
                        </div>
                        {u.full_name} {isSelf && <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>(You)</span>}
                      </div>
                    </td>
                    <td data-label="Email">{u.email}</td>
                    <td data-label="Role">
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
                    <td data-label="Status">
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                        padding: '0.25rem 0.5rem', borderRadius: '4px',
                        background: u.status === 'active' ? 'rgba(16,185,129,0.1)' : 
                                    u.status === 'pending' ? 'rgba(245,158,11,0.1)' : 
                                    'rgba(239,68,68,0.1)',
                        color: u.status === 'active' ? 'var(--color-success)' : 
                               u.status === 'pending' ? 'var(--color-warning)' : 
                               'var(--color-danger)',
                        fontSize: '0.875rem', fontWeight: 600, textTransform: 'capitalize'
                      }}>
                        {u.status === 'active' ? <MdCheckCircle /> : u.status === 'pending' ? <MdHourglassEmpty /> : <MdBlock />} {u.status}
                      </span>
                    </td>
                    <td data-label="Actions" style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {u.status === 'pending' ? (
                          <button 
                            className="btn btn-primary btn-sm" 
                            onClick={() => updateUserStatus(u.id, 'active')}
                            disabled={isSelf || loading}
                          >
                            Approve
                          </button>
                        ) : (
                          <button 
                            className="btn btn-secondary btn-sm" 
                            style={{ 
                              color: u.status === 'active' ? 'var(--color-danger)' : 'var(--color-success)', 
                              borderColor: u.status === 'active' ? 'var(--color-danger)' : 'var(--color-success)'
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
