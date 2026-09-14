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
          {/* Changed gridTemplateColumns for mobile stacking */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="card-flat" style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Allocated</div>
              <div style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 600 }}>{formatCurrency(currentReport.summary.totalAllocated)}</div>
            </div>
            <div className="card-flat" style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Spent</div>
              <div style={{ color: 'var(--color-danger)', fontSize: '1.5rem', fontWeight: 600 }}>{formatCurrency(currentReport.summary.totalSpent)}</div>
            </div>
            <div className="card-flat" style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Remaining Balance</div>
              <div style={{ color: 'var(--color-success)', fontSize: '1.5rem', fontWeight: 600 }}>{formatCurrency(currentReport.summary.remaining)}</div>
            </div>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Allocated</th>
                  <th>Spent</th>
                  <th>Remaining</th>
                  <th>Utilization</th>
                </tr>
              </thead>
              <tbody>
                {currentReport.breakdown.map((row, idx) => (
                  <tr key={idx}>
                    <td data-label="Category">{row.category}</td>
                    <td data-label="Allocated">{formatCurrency(row.allocated)}</td>
                    <td data-label="Spent" style={{ color: 'var(--color-danger)' }}>{formatCurrency(row.spent)}</td>
                    <td data-label="Remaining" style={{ color: 'var(--color-success)' }}>{formatCurrency(row.remaining)}</td>
                    <td data-label="Utilization">{row.utilization.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (currentReport.type === 'Project Status Report') {
      return (
        <div className="animate-fade-in-up">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className="card-flat" style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Projects</div>
              <div style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 600 }}>{currentReport.summary.totalProjects}</div>
            </div>
            {Object.entries(currentReport.summary.statusCounts).map(([status, count]) => (
              <div key={status} className="card-flat" style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{status}</div>
                <div style={{ color: 'var(--color-primary-600)', fontSize: '1.5rem', fontWeight: 600 }}>{count}</div>
              </div>
            ))}
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Status</th>
                  <th>Budget</th>
                  <th>Timeline</th>
                </tr>
              </thead>
              <tbody>
                {currentReport.projects.map((p, idx) => (
                  <tr key={idx}>
                    <td data-label="Project Name" style={{ fontWeight: 500 }}>{p.name}</td>
                    <td data-label="Status">{p.status}</td>
                    <td data-label="Budget">{formatCurrency(p.budget)}</td>
                    <td data-label="Timeline">{p.timeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      <div className="card">
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
