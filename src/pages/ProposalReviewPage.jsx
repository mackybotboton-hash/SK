import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import useProposals from '../hooks/useProposals';
import ProposalWorkflowStepper from '../components/proposals/ProposalWorkflowStepper';
import ProjectStatusBadge from '../components/projects/ProjectStatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import { MdArrowBack, MdCheck, MdClose } from 'react-icons/md';
import { PROPOSAL_STATUS } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import useBudgetStorage from '../hooks/useBudgetStorage';
import FormattedNumberInput from '../components/common/FormattedNumberInput';

export default function ProposalReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProposal: proposal, loading, error, loadProposal, reviewProposal } = useProposals(false);
  const { hasPermission } = useAuth();
  const { budgetData } = useBudgetStorage();
  const [feedback, setFeedback] = useState('');
  const [showFeedbackBox, setShowFeedbackBox] = useState(false);
  const [reviewAction, setReviewAction] = useState(null);
  
  // Council Metadata
  const [resolutionNo, setResolutionNo] = useState('');
  const [resolutionDate, setResolutionDate] = useState('');
  const [approvedBudget, setApprovedBudget] = useState('');
  const [abyipReference, setAbyipReference] = useState('');

  useEffect(() => {
    if (id) {
      loadProposal(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading && !proposal) {
    return <div className="page-enter" style={{ display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}><div className="spinner-lg" /></div>;
  }

  if (error || !proposal) {
    return <div className="alert alert-error">{error || 'Proposal not found'}</div>;
  }

  const handleActionClick = (action) => {
    setReviewAction(action);
    setShowFeedbackBox(true);
  };

  const handleConfirmReview = async () => {
    const status = reviewAction === 'approve' ? PROPOSAL_STATUS.APPROVED_BY_COUNCIL : PROPOSAL_STATUS.REJECTED;
    
    let councilData = null;
    if (reviewAction === 'approve') {
      councilData = {
        resolution_number: resolutionNo,
        resolution_date: resolutionDate,
        approved_budget: parseFloat(approvedBudget),
        abyip_reference: abyipReference
      };
    }
    
    const success = await reviewProposal(id, status, feedback, councilData);
    if (success) {
      setShowFeedbackBox(false);
    }
  };

  const canReview = (proposal.status === PROPOSAL_STATUS.SUBMITTED || proposal.status === PROPOSAL_STATUS.UNDER_COUNCIL_REVIEW);

  return (
    <div className="page-enter">
      <button 
        onClick={() => navigate('/proposals')} 
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: 0, fontWeight: 500 }}
      >
        <MdArrowBack size={20} /> Back to Proposals
      </button>

      <PageHeader title={proposal.title} description="Proposal Review Details">
        <ProjectStatusBadge status={proposal.status} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }} />
      </PageHeader>

      <div className="card glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <ProposalWorkflowStepper currentStatus={proposal.status} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginTop: '1rem', borderTop: '1px solid var(--border-default)', paddingTop: '2rem' }}>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Objective & Justification</h4>
            <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, background: 'var(--bg-elevated)', padding: '1rem', borderRadius: '8px', margin: 0 }}>
              {proposal.objective}
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Estimated Budget</span>
              <span style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 600 }}>{formatCurrency(proposal.estimated_budget)}</span>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Target Date</span>
              <span style={{ color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 500 }}>{formatDate(proposal.target_date)}</span>
            </div>
          </div>

          {proposal.feedback && (
            <div>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Review Feedback</h4>
              <p style={{ color: proposal.status === PROPOSAL_STATUS.REJECTED ? 'var(--danger)' : 'var(--text-primary)', lineHeight: 1.6, background: 'color-mix(in srgb, var(--danger) 5%, var(--bg-elevated))', padding: '1rem', borderRadius: '8px', margin: 0, border: proposal.status === PROPOSAL_STATUS.REJECTED ? '1px solid color-mix(in srgb, var(--danger) 30%, transparent)' : 'none' }}>
                {proposal.feedback}
              </p>
            </div>
          )}
        </div>
      </div>

      {hasPermission('approve:proposals') && canReview && (
        <div className="card glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Review Actions</h3>
          
          {!showFeedbackBox ? (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" style={{ background: 'var(--color-success)' }} onClick={() => handleActionClick('approve')}>
                <MdCheck size={20} style={{ marginRight: '0.5rem' }} /> Record Council Approval
              </button>
              <button className="btn btn-secondary" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleActionClick('reject')}>
                <MdClose size={20} style={{ marginRight: '0.5rem' }} /> Reject Proposal
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {reviewAction === 'approve' && (
                <div style={{ background: 'var(--bg-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>SK Council Resolution Details</h4>
                  
                  <div className="form-row-2col">
                    <div className="form-group">
                      <label>Resolution Number <span className="required">*</span></label>
                      <input type="text" className="form-control" value={resolutionNo} onChange={e => setResolutionNo(e.target.value)} placeholder="e.g. Res. 2026-05" required />
                    </div>
                    <div className="form-group">
                      <label>Resolution Date <span className="required">*</span></label>
                      <input type="date" className="form-control" value={resolutionDate} onChange={e => setResolutionDate(e.target.value)} required />
                    </div>
                  </div>
                  
                  <div className="form-row-2col">
                    <div className="form-group">
                      <label>Approved Budget Amount (₱) <span className="required">*</span></label>
                      <FormattedNumberInput className="form-control" value={approvedBudget} onChange={val => setApprovedBudget(val)} placeholder="0.00" required />
                    </div>
                    <div className="form-group">
                      <label>ABYIP Reference <span className="required">*</span></label>
                      <select className="form-control" value={abyipReference} onChange={e => setAbyipReference(e.target.value)} required>
                        <option value="">-- Select ABYIP PPA --</option>
                        {budgetData.ppas.length > 0 ? (
                          budgetData.ppas.map(ppa => (
                            <option key={ppa.id} value={ppa.name}>{ppa.name} (Budget: ₱{ppa.allocated_amount})</option>
                          ))
                        ) : (
                          <option value="" disabled>No PPAs found. Please configure SK Budget first.</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Feedback / Remarks {reviewAction === 'reject' && <span className="required">*</span>}</label>
                <textarea 
                  className="form-control" 
                  rows={4} 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={reviewAction === 'approve' ? "Optional notes about the approval..." : "Provide feedback to the proponent..."}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn btn-secondary" onClick={() => setShowFeedbackBox(false)} disabled={loading}>Cancel</button>
                <button 
                  className="btn btn-primary" 
                  style={{ background: reviewAction === 'approve' ? 'var(--success)' : 'var(--danger)', borderColor: reviewAction === 'approve' ? 'var(--success)' : 'var(--danger)' }}
                  onClick={handleConfirmReview}
                  disabled={loading || (reviewAction === 'reject' && !feedback.trim()) || (reviewAction === 'approve' && (!resolutionNo || !resolutionDate || !approvedBudget || !abyipReference))}
                >
                  Confirm {reviewAction === 'approve' ? 'Council Approval' : 'Rejection'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
