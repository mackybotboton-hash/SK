import React, { useState, useEffect } from 'react';
import { Document } from '../../models/Document';
import { useAuth } from '../../hooks/useAuth';

export default function DocumentUploadModal({ initialData = null, onSave, onCancel, loading = false }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState(new Document(initialData || { uploaded_by: user?.id }));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(new Document(initialData));
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

  const docTypes = ['Resolution', 'Ordinance', 'Receipt', 'Report', 'Meeting Minutes', 'Other'];

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="form-group">
        <label>Document Title *</label>
        <input 
          type="text" 
          name="title" 
          className="form-control" 
          value={formData.title} 
          onChange={handleChange} 
          disabled={loading}
          placeholder="e.g. SK Resolution No. 1 S. 2024"
        />
        {errors.title && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.title}</span>}
      </div>

      <div className="form-group">
        <label>Document Type *</label>
        <select 
          name="type" 
          className="form-control" 
          value={formData.type} 
          onChange={handleChange}
          disabled={loading}
        >
          {docTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        {errors.type && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.type}</span>}
      </div>

      <div className="form-group">
        <label>File URL / Cloud Link *</label>
        <input 
          type="text" 
          name="url" 
          className="form-control" 
          value={formData.url} 
          onChange={handleChange}
          disabled={loading}
          placeholder="Link to Google Drive, Dropbox, etc."
        />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem', display: 'block' }}>
          * For this version, paste a direct link to the hosted file.
        </span>
        {errors.url && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.url}</span>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Document'}
        </button>
      </div>
    </form>
  );
}
