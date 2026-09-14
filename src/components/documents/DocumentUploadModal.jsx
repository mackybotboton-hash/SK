import React, { useState, useEffect } from 'react';
import { Document } from '../../models/Document';
import { useAuth } from '../../hooks/useAuth';

export default function DocumentUploadModal({ initialData = null, onSave, onCancel, loading = false }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState(new Document(initialData || { uploaded_by: user?.id }));
  const [errors, setErrors] = useState({});
  const [uploadMethod, setUploadMethod] = useState(initialData?.url ? 'link' : 'upload');

  useEffect(() => {
    if (initialData) {
      setFormData(new Document(initialData));
      setUploadMethod(initialData.url ? 'link' : 'upload');
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => {
        const updated = prev.clone();
        updated.fileToUpload = file;
        updated.url = ''; // clear url if uploading a file
        return updated;
      });
      if (errors.url) setErrors(prev => ({ ...prev, url: null }));
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
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Document Source *
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                checked={uploadMethod === 'upload'} 
                onChange={() => {
                  setUploadMethod('upload');
                  setFormData(prev => { const upd = prev.clone(); upd.url = ''; return upd; });
                }}
                disabled={loading}
              />
              Upload File
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                checked={uploadMethod === 'link'} 
                onChange={() => {
                  setUploadMethod('link');
                  setFormData(prev => { const upd = prev.clone(); upd.fileToUpload = null; return upd; });
                }}
                disabled={loading}
              />
              Cloud Link
            </label>
          </div>
        </label>

        {uploadMethod === 'upload' ? (
          <>
            <input 
              type="file" 
              className="form-control" 
              onChange={handleFileChange}
              disabled={loading}
              style={{ padding: '0.5rem' }}
            />
            {formData.fileToUpload && (
              <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                Selected: {formData.fileToUpload.name} ({(formData.fileToUpload.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </>
        ) : (
          <>
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
              * Paste a direct link to the hosted file.
            </span>
          </>
        )}
        {errors.url && <span style={{ color: 'var(--danger)', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>{errors.url}</span>}
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
