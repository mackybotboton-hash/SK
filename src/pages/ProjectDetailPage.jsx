import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import useProjects from '../hooks/useProjects';
import ProjectStatusBadge from '../components/projects/ProjectStatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import { MdArrowBack, MdAccountBalance, MdReceipt, MdAttachFile } from 'react-icons/md';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProject: project, loading, error, loadProject } = useProjects(false);

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading || !project) {
    return (
      <div className="page-enter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner-lg" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="page-enter">
      <button 
        onClick={() => navigate('/projects')} 
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: 0, fontWeight: 500 }}
      >
        <MdArrowBack size={20} /> Back to Projects
      </button>

      <PageHeader 
        title={project.name} 
        description={`Category: ${project.category}`}
      >
        <ProjectStatusBadge status={project.status} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }} />
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card glass-panel animate-fade-in-up" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Project Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-default)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Proposed Budget</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(project.proposed_budget)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-default)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Approved Budget</span>
              <span style={{ fontWeight: 600, color: 'var(--success)' }}>{project.approved_budget ? formatCurrency(project.approved_budget) : 'Pending'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-default)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Timeline</span>
              <span style={{ color: 'var(--text-primary)', textAlign: 'right' }}>{formatDate(project.start_date)} <br/>to {formatDate(project.end_date) || 'TBD'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-default)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Beneficiaries</span>
              <span style={{ color: 'var(--text-primary)' }}>{project.beneficiaries || 'Not specified'}</span>
            </div>
            {project.description && (
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</span>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, padding: '1rem', background: 'var(--bg-elevated)', borderRadius: '8px' }}>
                  {project.description}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Mockups for next loops integration */}
        <div className="card glass-panel animate-fade-in-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', animationDelay: '0.1s' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>Linked Resources</h3>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', margin: 0 }}>These modules will be connected in upcoming loops.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <div className="hover-lift" style={{ padding: '1.25rem', border: '1px solid var(--border-default)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', background: 'var(--bg-elevated)', cursor: 'not-allowed' }}>
              <MdAccountBalance size={24} style={{ color: 'var(--info)' }} /> 
              <span style={{ fontWeight: 500 }}>Budget Allocation (Loop 5)</span>
            </div>
            <div className="hover-lift" style={{ padding: '1.25rem', border: '1px solid var(--border-default)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', background: 'var(--bg-elevated)', cursor: 'not-allowed' }}>
              <MdReceipt size={24} style={{ color: 'var(--warning)' }} /> 
              <span style={{ fontWeight: 500 }}>Expenses (Loop 5)</span>
            </div>
            <div className="hover-lift" style={{ padding: '1.25rem', border: '1px solid var(--border-default)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', background: 'var(--bg-elevated)', cursor: 'not-allowed' }}>
              <MdAttachFile size={24} style={{ color: 'var(--primary)' }} /> 
              <span style={{ fontWeight: 500 }}>Documents (Loop 6)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
