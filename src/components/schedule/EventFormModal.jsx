import React, { useState, useEffect } from 'react';
import { Activity } from '../../models/Activity';

export default function EventFormModal({ initialData = null, onSave, onCancel, loading = false }) {
  const [formData, setFormData] = useState(new Activity(initialData || {}));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(new Activity(initialData));
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

  const activityTypes = ['Meeting', 'Event', 'Deadline', 'Other'];

  const getDatetimeLocalString = (dateObj) => {
    if (!dateObj) return '';
    const date = new Date(dateObj);
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="form-group">
        <label>Title *</label>
        <input 
          type="text" 
          name="title" 
          className="form-control" 
          value={formData.title} 
          onChange={handleChange} 
          disabled={loading}
          placeholder="e.g. Monthly Council Meeting"
        />
        {errors.title && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.title}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>Type *</label>
          <select 
            name="type" 
            className="form-control" 
            value={formData.type} 
            onChange={handleChange}
            disabled={loading}
          >
            {activityTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Location</label>
          <input 
            type="text" 
            name="location" 
            className="form-control" 
            value={formData.location} 
            onChange={handleChange} 
            disabled={loading}
            placeholder="e.g. Barangay Hall"
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>Start Time *</label>
          <input 
            type="datetime-local" 
            name="start_time" 
            className="form-control" 
            value={getDatetimeLocalString(formData.start_time)} 
            onChange={handleChange}
            disabled={loading}
          />
          {errors.start_time && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.start_time}</span>}
        </div>

        <div className="form-group">
          <label>End Time *</label>
          <input 
            type="datetime-local" 
            name="end_time" 
            className="form-control" 
            value={getDatetimeLocalString(formData.end_time)} 
            onChange={handleChange}
            disabled={loading}
          />
          {errors.end_time && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.end_time}</span>}
          {errors.time_logic && <span style={{ color: 'var(--danger)', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>{errors.time_logic}</span>}
        </div>
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
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Activity'}
        </button>
      </div>
    </form>
  );
}
