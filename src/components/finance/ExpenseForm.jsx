import React, { useState, useEffect } from 'react';
import { Expense } from '../../models/Expense';
import { PROJECT_CATEGORIES } from '../../utils/constants';
import FormattedNumberInput from '../common/FormattedNumberInput';

export default function ExpenseForm({ initialData = null, onSave, onCancel, loading = false }) {
  const [formData, setFormData] = useState(new Expense(initialData || {}));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(new Expense(initialData));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = prev.clone();
      updated[name] = value;
      return updated;
    });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
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
        <label>Description *</label>
        <input 
          type="text" 
          name="description" 
          className="form-control" 
          value={formData.description} 
          onChange={handleChange} 
          disabled={loading}
          placeholder="e.g. Purchase of sports equipment"
        />
        {errors.description && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.description}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>Budget Category *</label>
          <select 
            name="budget_category" 
            className="form-control" 
            value={formData.budget_category} 
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select Category</option>
            {PROJECT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          {errors.budget_category && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.budget_category}</span>}
        </div>

        <div className="form-group">
          <label>Amount (₱) *</label>
          <FormattedNumberInput 
            name="amount" 
            className="form-control" 
            value={formData.amount || ''} 
            onChange={handleChange}
            disabled={loading}
            placeholder="0.00"
          />
          {errors.amount && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.amount}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>Date *</label>
          <input 
            type="date" 
            name="date" 
            className="form-control" 
            value={formData.toJSON().date || ''} 
            onChange={handleChange}
            disabled={loading}
          />
          {errors.date && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.date}</span>}
        </div>

        <div className="form-group">
          <label>Receipt URL / Attachment</label>
          <input 
            type="text" 
            name="receipt_url" 
            className="form-control" 
            value={formData.receipt_url} 
            onChange={handleChange}
            disabled={loading}
            placeholder="Link to file..."
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Expense'}
        </button>
      </div>
    </form>
  );
}
