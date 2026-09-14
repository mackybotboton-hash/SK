import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import useProposals from '../hooks/useProposals';
import { Proposal } from '../models/Proposal';
import { useAuth } from '../hooks/useAuth';
import { MdArrowBack, MdSave, MdSend } from 'react-icons/md';
import FormattedNumberInput from '../components/common/FormattedNumberInput';

export default function ProposalFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadProposal, saveProposal, submitProposal, loading, error } = useProposals(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState(new Proposal({ proponent_id: user?.id }));
  const [errors, setErrors] = useState({});
  const [initialLoading, setInitialLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      loadProposal(id).then(prop => {
        if (prop) setFormData(new Proposal(prop));
        setInitialLoading(false);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = prev.clone();
      updated[name] = value;
      return updated;
    });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSaveDraft = async () => {
    if (!formData.validate()) {
      setErrors(formData.getFieldErrors());
      return;
    }
    const saved = await saveProposal(formData);
    if (saved && !id) {
      navigate(`/proposals/${saved.id}/edit`, { replace: true });
    }
  };

  const handleSubmit = async () => {
    if (!formData.validate()) {
      setErrors(formData.getFieldErrors());
      return;
    }
    const saved = await saveProposal(formData);
    if (saved) {
      const submitted = await submitProposal(saved.id);
      if (submitted) navigate('/proposals');
    }
  };

  if (initialLoading) {
    return <div className="page-enter" style={{ display: 'flex', justifyContent: 'center', minHeight: '50vh', alignItems: 'center' }}><div className="spinner-lg" /></div>;
  }

  return (
    <div className="page-enter">
      <button 
        onClick={() => navigate('/proposals')} 
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: 0, fontWeight: 500 }}
      >
        <MdArrowBack size={20} /> Back to Proposals
      </button>

      <PageHeader 
        title={id ? 'Edit Proposal' : 'New Proposal'} 
        description="Draft and submit a new project proposal for review." 
      />

      {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      <div className="card glass-panel" style={{ padding: '2rem', maxWidth: '800px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label>Proposal Title *</label>
            <input 
              type="text" 
              name="title" 
              className="form-control" 
              value={formData.title} 
              onChange={handleChange} 
              disabled={loading}
              placeholder="e.g. Barangay Youth Sports Festival"
            />
            {errors.title && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.title}</span>}
          </div>

          <div className="form-row-2col">
            <div className="form-group">
              <label>Estimated Budget (₱) *</label>
              <FormattedNumberInput 
                name="estimated_budget" 
                className="form-control" 
                value={formData.estimated_budget || ''} 
                onChange={handleChange}
                disabled={loading}
                placeholder="0.00"
              />
              {errors.estimated_budget && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.estimated_budget}</span>}
            </div>

            <div className="form-group">
              <label>Target Implementation Date *</label>
              <input 
                type="date" 
                name="target_date" 
                className="form-control" 
                value={formData.toJSON().target_date || ''} 
                onChange={handleChange}
                disabled={loading}
              />
              {errors.target_date && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.target_date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Objective & Justification *</label>
            <textarea 
              name="objective" 
              className="form-control" 
              value={formData.objective} 
              onChange={handleChange}
              disabled={loading}
              rows={6}
              placeholder="Explain the purpose of this project and why it is needed..."
            />
            {errors.objective && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.objective}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={handleSaveDraft} disabled={loading}>
              <MdSave style={{ marginRight: '0.5rem' }} /> Save as Draft
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              <MdSend style={{ marginRight: '0.5rem' }} /> Submit for Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
