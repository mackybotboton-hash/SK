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
      case 'created': return 'var(--color-success)';
      case 'updated': return 'var(--color-info)';
      case 'deleted': return 'var(--color-danger)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="page-enter">
      <PageHeader title="Audit Log" description="Review all administrative and system activity" />

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
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

      <div className="data-table-wrapper">
        {loading && logs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner-lg" style={{ margin: '0 auto' }} /></div>
        ) : filteredLogs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-muted)' }}><MdHistory /></div>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>No audit logs found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Details</th>
                <th>User ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td data-label="Timestamp" style={{ whiteSpace: 'nowrap' }}>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td data-label="Action">
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      background: 'var(--bg-surface-hover)', 
                      color: getActionColor(log.action),
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase'
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td data-label="Resource" style={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    {log.resource}
                  </td>
                  <td data-label="Details">
                    <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.details}>
                      {log.details}
                    </div>
                  </td>
                  <td data-label="User ID" style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
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
