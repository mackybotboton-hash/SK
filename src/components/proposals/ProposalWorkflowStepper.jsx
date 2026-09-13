import React from 'react';
import { PROPOSAL_STATUS } from '../../utils/constants';
import { MdEdit, MdSend, MdRateReview, MdCheckCircle, MdCancel } from 'react-icons/md';

export default function ProposalWorkflowStepper({ currentStatus }) {
  const steps = [
    { status: PROPOSAL_STATUS.DRAFT, label: 'Draft', icon: MdEdit },
    { status: PROPOSAL_STATUS.SUBMITTED, label: 'Submitted', icon: MdSend },
    { status: PROPOSAL_STATUS.UNDER_REVIEW, label: 'Under Review', icon: MdRateReview },
  ];

  let finalStep = { status: PROPOSAL_STATUS.APPROVED, label: 'Approved', icon: MdCheckCircle };
  if (currentStatus === PROPOSAL_STATUS.REJECTED) {
    finalStep = { status: PROPOSAL_STATUS.REJECTED, label: 'Rejected', icon: MdCancel, isError: true };
  }

  const allSteps = [...steps, finalStep];

  const getStepIndex = (status) => {
    if (status === PROPOSAL_STATUS.REJECTED || status === PROPOSAL_STATUS.APPROVED) return 3;
    return steps.findIndex(s => s.status === status);
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '0 auto', padding: '1rem 0 2.5rem 0' }}>
      {allSteps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const color = step.isError ? 'var(--danger)' : (isCompleted || isCurrent ? 'var(--primary)' : 'var(--text-tertiary)');
        
        return (
          <React.Fragment key={step.status}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: (isCompleted || isCurrent) ? `color-mix(in srgb, ${color} 15%, transparent)` : 'var(--bg-elevated)',
                color: color,
                border: `2px solid ${color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
                transition: 'all 0.3s ease'
              }}>
                <Icon size={20} />
              </div>
              <span style={{ 
                position: 'absolute', top: '48px', whiteSpace: 'nowrap', 
                fontSize: '0.75rem', fontWeight: isCurrent ? 600 : 400,
                color: (isCompleted || isCurrent) ? 'var(--text-primary)' : 'var(--text-tertiary)'
              }}>
                {step.label}
              </span>
            </div>
            {index < allSteps.length - 1 && (
              <div style={{
                flex: 1, height: '2px', margin: '0 0.5rem',
                background: isCompleted ? 'var(--primary)' : 'var(--border-default)',
                transition: 'all 0.3s ease',
                zIndex: 1
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
