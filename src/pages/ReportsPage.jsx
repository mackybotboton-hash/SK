import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import ReportGenerator from '../components/reports/ReportGenerator';
import useReports from '../hooks/useReports';
import { formatCurrency } from '../utils/formatters';

export default function ReportsPage() {
  const { currentReport } = useReports();

  const renderReportContent = () => {
    if (!currentReport) {
      return (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-tertiary)' }}>
          Select parameters above and click "Generate Report"
        </div>
      );
    }

    if (currentReport.type === 'Financial Report') {
      return (
        <div className="animate-fade-in-up">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--bg-elevated)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Allocated</div>
              <div style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 600 }}>{formatCurrency(currentReport.summary.totalAllocated)}</div>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Spent</div>
              <div style={{ color: 'var(--danger)', fontSize: '1.5rem', fontWeight: 600 }}>{formatCurrency(currentReport.summary.totalSpent)}</div>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Remaining Balance</div>
              <div style={{ color: 'var(--success)', fontSize: '1.5rem', fontWeight: 600 }}>{formatCurrency(currentReport.summary.remaining)}</div>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Category</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Allocated</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Spent</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Remaining</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Utilization</th>
              </tr>
            </thead>
            <tbody>
              {currentReport.breakdown.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{row.category}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{formatCurrency(row.allocated)}</td>
                  <td style={{ padding: '1rem', color: 'var(--danger)' }}>{formatCurrency(row.spent)}</td>
                  <td style={{ padding: '1rem', color: 'var(--success)' }}>{formatCurrency(row.remaining)}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{row.utilization.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (currentReport.type === 'Project Status Report') {
      return (
        <div className="animate-fade-in-up">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--bg-elevated)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Projects</div>
              <div style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 600 }}>{currentReport.summary.totalProjects}</div>
            </div>
            {Object.entries(currentReport.summary.statusCounts).map(([status, count]) => (
              <div key={status} style={{ background: 'var(--bg-elevated)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{status}</div>
                <div style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 600 }}>{count}</div>
              </div>
            ))}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Project Name</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Budget</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Timeline</th>
              </tr>
            </thead>
            <tbody>
              {currentReport.projects.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{p.status}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{formatCurrency(p.budget)}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{p.timeline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div className="page-enter">
      <PageHeader title="Analytics & Reports" description="Generate comprehensive data exports for auditing and review" />
      
      <div style={{ marginBottom: '2rem' }}>
        <ReportGenerator />
      </div>

      <div className="card glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            {currentReport ? currentReport.type : 'Report Preview'}
          </h3>
          {currentReport && (
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
              Generated: {new Date(currentReport.generatedAt).toLocaleString()}
            </span>
          )}
        </div>
        
        {renderReportContent()}
      </div>
    </div>
  );
}
