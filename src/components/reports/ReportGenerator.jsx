import React, { useState } from 'react';
import useReports from '../../hooks/useReports';
import { MdInsertChart, MdFileDownload, MdClear } from 'react-icons/md';

export default function ReportGenerator() {
  const { currentReport, generateReport, clearReport, loading } = useReports();
  const [type, setType] = useState('financial');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setError(null);
    if (type === 'financial' && (!startDate || !endDate)) {
      setError('Please select a date range for the financial report.');
      return;
    }
    await generateReport(type, startDate, endDate);
  };

  const downloadCSV = () => {
    if (!currentReport) return;
    
    // Very basic CSV generation for demo
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (currentReport.type === 'Financial Report') {
      csvContent += "Category,Allocated,Spent,Remaining,Utilization (%)\n";
      currentReport.breakdown.forEach(row => {
        csvContent += `${row.category},${row.allocated},${row.spent},${row.remaining},${row.utilization.toFixed(2)}\n`;
      });
    } else {
      csvContent += "Project Name,Status,Budget,Timeline\n";
      currentReport.projects.forEach(row => {
        csvContent += `"${row.name}",${row.status},${row.budget},"${row.timeline}"\n`;
      });
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${currentReport.type.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card glass-panel" style={{ padding: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Report Generator</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label>Report Type</label>
          <select className="form-control" value={type} onChange={(e) => setType(e.target.value)} disabled={loading}>
            <option value="financial">Financial Report</option>
            <option value="projects">Project Status Report</option>
          </select>
        </div>
        
        {type === 'financial' && (
          <>
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={loading} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={loading} />
            </div>
          </>
        )}
      </div>
      
      {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn btn-primary" onClick={handleGenerate} disabled={loading} style={{ display: 'flex', alignItems: 'center' }}>
          <MdInsertChart style={{ marginRight: '0.5rem' }} /> {loading ? 'Generating...' : 'Generate Report'}
        </button>
        {currentReport && (
          <>
            <button className="btn btn-secondary" onClick={downloadCSV} style={{ display: 'flex', alignItems: 'center' }}>
              <MdFileDownload style={{ marginRight: '0.5rem' }} /> Export CSV
            </button>
            <button className="btn btn-secondary" onClick={clearReport} style={{ display: 'flex', alignItems: 'center', color: 'var(--danger)' }}>
              <MdClear style={{ marginRight: '0.5rem' }} /> Clear
            </button>
          </>
        )}
      </div>
    </div>
  );
}
