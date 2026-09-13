import React, { useState, useEffect } from 'react';
import { Project } from '../../models/Project';
import { PROJECT_CATEGORIES } from '../../utils/constants';
import FormattedNumberInput from '../common/FormattedNumberInput';

export default function ProjectForm({ initialData = null, onSave, onCancel, loading = false }) {
  const [formData, setFormData] = useState(new Project(initialData || {}));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(new Project(initialData));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = prev.clone();
      updated[name] = value;
      return updated;
    });
    // clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.validate()) {
      setErrors(formData.getFieldErrors());
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="form-group">
        <label>Project Name *</label>
        <input 
          type="text" 
          name="name" 
          className="form-control" 
          value={formData.name} 
          onChange={handleChange} 
          disabled={loading}
          placeholder="e.g. Inter-Barangay Basketball League"
        />
        {errors.name && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.name}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>Category *</label>
          <select 
            name="category" 
            className="form-control" 
            value={formData.category} 
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select Category</option>
            {PROJECT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          {errors.category && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.category}</span>}
        </div>

        <div className="form-group">
          <label>Proposed Budget (₱) *</label>
          <FormattedNumberInput 
            name="proposed_budget" 
            className="form-control" 
            value={formData.proposed_budget || ''} 
            onChange={handleChange}
            disabled={loading}
            placeholder="0.00"
          />
          {errors.proposed_budget && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.proposed_budget}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>Start Date *</label>
          <input 
            type="date" 
            name="start_date" 
            className="form-control" 
            value={formData.toJSON().start_date || ''} 
            onChange={handleChange}
            disabled={loading}
          />
          {errors.start_date && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.start_date}</span>}
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input 
            type="date" 
            name="end_date" 
            className="form-control" 
            value={formData.toJSON().end_date || ''} 
            onChange={handleChange}
            disabled={loading}
          />
          {errors.end_date && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.end_date}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Beneficiaries</label>
        <input 
          type="text" 
          name="beneficiaries" 
          className="form-control" 
          value={formData.beneficiaries} 
          onChange={handleChange}
          disabled={loading}
          placeholder="e.g., Youth aged 15-30"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea 
          name="description" 
          className="form-control" 
          value={formData.description} 
          onChange={handleChange}
          disabled={loading}
          rows={3}
          placeholder="Brief description of the project goals..."
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Project'}
        </button>
      </div>
    </form>
  );
}
