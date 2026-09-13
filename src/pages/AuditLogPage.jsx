import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import useAuditLogs from '../hooks/useAuditLogs';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/formatters';
import { MdSearch, MdHistory, MdFilterList } from 'react-icons/md';

export default function AuditLogPage() {
  const { logs, loading } = useAuditLogs();
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('All');

  if (!hasPermission('view:audit_logs')) {
    return (
      <div className="page-enter">
        <PageHeader title="Access Denied" />
        <div className="alert alert-error">You do not have permission to view audit logs.</div>
      </div>
    );
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.resource && log.resource.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAction = filterAction === 'All' || log.action === filterAction;
    
    return matchesSearch && matchesAction;
  });

  const getActionColor = (action) => {
    switch (action) {
      case 'created': return 'var(--success)';
      case 'updated': return 'var(--info)';
      case 'deleted': return 'var(--danger)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="page-enter">
      <PageHeader title="Audit Log" description="Review all administrative and system activity" />

      <div className="card glass-panel" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
            <MdSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} size={20} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search by resource or details..." 
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MdFilterList color="var(--text-tertiary)" size={20} />
            <select 
              className="form-control" 
              value={filterAction} 
              onChange={(e) => setFilterAction(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="All">All Actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card glass-panel" style={{ overflowX: 'auto' }}>
        {loading && logs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner-lg" style={{ margin: '0 auto' }} /></div>
        ) : filteredLogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}><MdHistory /></div>
            <p className="empty-state-title" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>No audit logs found</p>
          </div>
        ) : (
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Timestamp</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Action</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Resource</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Details</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>User ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover-lift" style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      background: 'var(--bg-body)', 
                      color: getActionColor(log.action),
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase'
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 500, textTransform: 'capitalize' }}>
                    {log.resource}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.details}>
                      {log.details}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                    {log.user_id || 'System'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
