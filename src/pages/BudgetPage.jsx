import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import useBudgetStorage from '../hooks/useBudgetStorage';
import { formatCurrency } from '../utils/formatters';
import { STATUTORY_LIMITS } from '../utils/constants';
import { MdAccountBalance, MdAssignment, MdSecurity, MdAdd, MdSave, MdCheck, MdWarning } from 'react-icons/md';
import FormattedNumberInput from '../components/common/FormattedNumberInput';

export default function BudgetPage() {
  const { 
    budgetData, 
    updateFund, 
    addPPA, 
    updateAllocations, 
    authorizeBudget, 
    getTotalAllocated 
  } = useBudgetStorage();

  const [activeTab, setActiveTab] = useState('setup');
  
  // Setup State
  const [generalFund, setGeneralFund] = useState(budgetData.generalFund || '');
  
  // ABYIP State
  const [newPpaName, setNewPpaName] = useState('');
  const [newPpaBudget, setNewPpaBudget] = useState('');
  
  // Allocation State
  const [psAmount, setPsAmount] = useState(budgetData.personalServices || '');
  const [trainingAmount, setTrainingAmount] = useState(budgetData.training || '');
  
  // Auth State
  const [resNo, setResNo] = useState(budgetData.resolutionNo || '');
  const [resDate, setResDate] = useState(budgetData.resolutionDate || '');

  const handleSaveFund = () => {
    updateFund(generalFund);
    alert('SK Fund Base Updated!');
  };

  const handleAddPPA = () => {
    if (newPpaName && newPpaBudget) {
      addPPA({ name: newPpaName, allocated_amount: parseFloat(newPpaBudget) });
      setNewPpaName('');
      setNewPpaBudget('');
    }
  };

  const handleSaveAllocations = () => {
    updateAllocations(psAmount, trainingAmount);
    alert('Allocations Saved!');
  };

  const handleAuthorize = () => {
    if (resNo && resDate) {
      authorizeBudget(resNo, resDate);
      alert('Budget Officially Authorized!');
    }
  };

  const totalAllocated = getTotalAllocated();
  const unallocated = budgetData.skFund - totalAllocated;
  
  const psPercent = budgetData.skFund > 0 ? ((budgetData.personalServices / budgetData.skFund) * 100).toFixed(1) : 0;
  const trainingPercent = budgetData.skFund > 0 ? ((budgetData.training / budgetData.skFund) * 100).toFixed(1) : 0;
  
  const psExceeds = (budgetData.personalServices / budgetData.skFund) > STATUTORY_LIMITS.PERSONAL_SERVICES;
  const trainingExceeds = (budgetData.training / budgetData.skFund) > STATUTORY_LIMITS.TRAINING;
  const totalExceeds = totalAllocated > budgetData.skFund;

  return (
    <div className="page-enter">
      <PageHeader title="Financial Planning & Budgeting" description="Manage SK Fund limits, ABYIP allocations, and Authorizations" />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-strong)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('setup')} 
          style={{ background: 'none', border: 'none', borderBottom: activeTab === 'setup' ? '2px solid var(--color-primary-500)' : '2px solid transparent', padding: '0.5rem 1rem', color: activeTab === 'setup' ? 'var(--color-primary-500)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <MdAccountBalance /> 1. SK Fund Setup
        </button>
        <button 
          onClick={() => setActiveTab('allocation')} 
          style={{ background: 'none', border: 'none', borderBottom: activeTab === 'allocation' ? '2px solid var(--color-primary-500)' : '2px solid transparent', padding: '0.5rem 1rem', color: activeTab === 'allocation' ? 'var(--color-primary-500)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <MdAssignment /> 2. Annual Budget Allocation
        </button>
        <button 
          onClick={() => setActiveTab('auth')} 
          style={{ background: 'none', border: 'none', borderBottom: activeTab === 'auth' ? '2px solid var(--color-primary-500)' : '2px solid transparent', padding: '0.5rem 1rem', color: activeTab === 'auth' ? 'var(--color-primary-500)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <MdSecurity /> 3. Authorization & Review
        </button>
      </div>

      {activeTab === 'setup' && (
        <div className="card" style={{ maxWidth: '600px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Source of Funds</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>The SK Fund is strictly 10% of the Barangay General Fund.</p>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Barangay General Fund (₱)</label>
            <FormattedNumberInput 
              className="form-control" 
              value={generalFund} 
              onChange={val => setGeneralFund(val)} 
              placeholder="e.g. 5,000,000"
            />
          </div>
          
          <div style={{ background: 'var(--clay-bg-light)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', boxShadow: 'var(--clay-shadow-pressed)' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Calculated 10% SK Fund</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-500)' }}>
              {formatCurrency(generalFund * 0.10)}
            </div>
          </div>
          
          <button className="btn btn-primary" onClick={handleSaveFund}>Save SK Fund Base</button>
        </div>
      )}

      {activeTab === 'allocation' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* PPAs */}
            <div className="card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>ABYIP Programs, Projects & Activities (PPAs)</h3>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <input type="text" className="form-control" placeholder="PPA Name" value={newPpaName} onChange={e => setNewPpaName(e.target.value)} />
                <FormattedNumberInput className="form-control" placeholder="Budget Amount" value={newPpaBudget} onChange={val => setNewPpaBudget(val)} style={{ width: '180px' }} />
                <button className="btn btn-secondary" onClick={handleAddPPA}><MdAdd /> Add</button>
              </div>

              {budgetData.ppas.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {budgetData.ppas.map(ppa => (
                    <div key={ppa.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--clay-bg-light)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--clay-shadow-pressed)' }}>
                      <div style={{ fontWeight: 600 }}>{ppa.name}</div>
                      <div style={{ color: 'var(--color-primary-500)', fontWeight: 700 }}>{formatCurrency(ppa.allocated_amount)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>No PPAs added yet.</div>
              )}
            </div>

            {/* Statutory Limits */}
            <div className="card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Statutory Allocations</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label>Personal Services (Max 25%)</label>
                  <FormattedNumberInput className="form-control" value={psAmount} onChange={val => setPsAmount(val)} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>Mandatory Training (Max 15%)</label>
                  <FormattedNumberInput className="form-control" value={trainingAmount} onChange={val => setTrainingAmount(val)} placeholder="0.00" />
                </div>
              </div>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={handleSaveAllocations}><MdSave /> Save Allocations</button>
            </div>
          </div>

          {/* Compliance Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Budget Compliance</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total SK Fund</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatCurrency(budgetData.skFund)}</div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Unallocated Balance</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: unallocated < 0 ? 'var(--danger)' : 'var(--success)' }}>
                  {formatCurrency(unallocated)}
                </div>
                {totalExceeds && <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MdWarning /> Exceeds Total SK Fund</div>}
              </div>

              <div style={{ borderTop: '1px solid var(--border-medium)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    <span>Personal Services (25%)</span>
                    <span style={{ color: psExceeds ? 'var(--danger)' : 'inherit', fontWeight: psExceeds ? 700 : 400 }}>{psPercent}%</span>
                  </div>
                  {psExceeds && <div style={{ color: 'var(--danger)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MdWarning /> Exceeds statutory limit of 25%</div>}
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    <span>Training (15%)</span>
                    <span style={{ color: trainingExceeds ? 'var(--danger)' : 'inherit', fontWeight: trainingExceeds ? 700 : 400 }}>{trainingPercent}%</span>
                  </div>
                  {trainingExceeds && <div style={{ color: 'var(--danger)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MdWarning /> Exceeds statutory limit of 15%</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'auth' && (
        <div className="card" style={{ maxWidth: '600px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>SK Budget Resolution</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Record the formal SK Resolution approving this Annual Budget.</p>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>SK Resolution Number</label>
            <input type="text" className="form-input" value={resNo} onChange={e => setResNo(e.target.value)} placeholder="e.g. Res. 2026-10" />
          </div>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Resolution Date</label>
            <input type="date" className="form-input" value={resDate} onChange={e => setResDate(e.target.value)} />
          </div>

          <button className="btn btn-primary" onClick={handleAuthorize} disabled={budgetData.isAuthorized}>
            {budgetData.isAuthorized ? <><MdCheck /> Budget Authorized</> : 'Authorize Budget'}
          </button>
        </div>
      )}
    </div>
  );
}
