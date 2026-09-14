import React, { useState, useRef } from 'react';
import PageHeader from '../components/layout/PageHeader';
import useLandingPageManager from '../hooks/useLandingPageManager';
import { MdEdit, MdDelete, MdAdd, MdSave, MdCheck } from 'react-icons/md';
import storageService from '../services/StorageService';

export default function LandingPageManager() {
  const { landingData, updateHeroContent, addOfficial, updateOfficial, removeOfficial } = useLandingPageManager();
  
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaved, setIsSaved] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  // Local state for forms
  const [heroForm, setHeroForm] = useState({
    heroTitle: landingData?.heroTitle || '',
    heroDesc: landingData?.heroDesc || '',
    heroImage: landingData?.heroImage || '/sk-officials.png',
  });

  const [contactForm, setContactForm] = useState({
    facebookLink: landingData?.facebookLink || '',
    location: landingData?.location || '',
    shortLocation: landingData?.shortLocation || '',
    facebookFollowers: landingData?.facebookFollowers || '',
  });

  // Official edit modal/inline state
  const [editingOfficialId, setEditingOfficialId] = useState(null);
  const [officialForm, setOfficialForm] = useState({ name: '', role: '', desc: '', icon: '👤' });

  const handleSaveHero = () => {
    updateHeroContent(heroForm);
    triggerSaveAlert();
  };

  const handleSaveContact = () => {
    updateHeroContent(contactForm);
    triggerSaveAlert();
  };

  const triggerSaveAlert = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingHero(true);
    try {
      const result = await storageService.uploadFile('documents', file, `assets/hero_${Date.now()}_${file.name}`);
      setHeroForm({ ...heroForm, heroImage: result.url });
    } catch (err) {
      console.error('Failed to upload hero image:', err);
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingHero(false);
    }
  };

  const handleEditOfficial = (off) => {
    setEditingOfficialId(off.id);
    setOfficialForm({ name: off.name, role: off.role, desc: off.desc, icon: off.icon });
  };

  const handleSaveOfficial = () => {
    if (editingOfficialId === 'new') {
      addOfficial(officialForm);
    } else {
      updateOfficial(editingOfficialId, officialForm);
    }
    setEditingOfficialId(null);
    triggerSaveAlert();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to max 500x500 to save localStorage space
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 jpeg
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setOfficialForm({ ...officialForm, icon: dataUrl });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="page-enter">
      <PageHeader title="Landing Page Editor" description="Manage content on the public landing page" />

      {isSaved && (
        <div style={{ background: 'var(--success)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MdCheck size={20} /> Changes saved successfully!
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-strong)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('hero')} 
          style={{ background: 'none', border: 'none', borderBottom: activeTab === 'hero' ? '2px solid var(--color-primary-500)' : '2px solid transparent', padding: '0.5rem 1rem', color: activeTab === 'hero' ? 'var(--color-primary-500)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}
        >
          Hero Content
        </button>
        <button 
          onClick={() => setActiveTab('officials')} 
          style={{ background: 'none', border: 'none', borderBottom: activeTab === 'officials' ? '2px solid var(--color-primary-500)' : '2px solid transparent', padding: '0.5rem 1rem', color: activeTab === 'officials' ? 'var(--color-primary-500)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}
        >
          SK Officials
        </button>
        <button 
          onClick={() => setActiveTab('contact')} 
          style={{ background: 'none', border: 'none', borderBottom: activeTab === 'contact' ? '2px solid var(--color-primary-500)' : '2px solid transparent', padding: '0.5rem 1rem', color: activeTab === 'contact' ? 'var(--color-primary-500)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}
        >
          Contact & Links
        </button>
      </div>

      {activeTab === 'hero' && (
        <div className="card glass-panel" style={{ maxWidth: '800px', padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Hero Section Editor</h3>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Hero Title</label>
            <input 
              type="text" 
              className="form-control" 
              value={heroForm.heroTitle} 
              onChange={e => setHeroForm({ ...heroForm, heroTitle: e.target.value })} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Hero Description</label>
            <textarea 
              className="form-control" 
              rows={4}
              value={heroForm.heroDesc} 
              onChange={e => setHeroForm({ ...heroForm, heroDesc: e.target.value })} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Hero Image (High Resolution supported)</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Image URL" 
                value={heroForm.heroImage} 
                onChange={e => setHeroForm({ ...heroForm, heroImage: e.target.value })} 
                style={{ flex: 1 }} 
              />
              <input 
                type="file" 
                accept="image/*" 
                id="hero-image-upload" 
                style={{ display: 'none' }} 
                onChange={handleHeroImageUpload} 
              />
              <label 
                htmlFor="hero-image-upload" 
                className="btn btn-secondary" 
                style={{ margin: 0, cursor: 'pointer', whiteSpace: 'nowrap', opacity: uploadingHero ? 0.5 : 1, pointerEvents: uploadingHero ? 'none' : 'auto' }}
              >
                {uploadingHero ? 'Uploading...' : 'Upload Image'}
              </label>
            </div>
            {heroForm.heroImage && (
               <div style={{ marginTop: '0.5rem', width: '200px', height: '140px', borderRadius: '8px', background: `url(${heroForm.heroImage}) center/cover no-repeat`, border: '1px solid var(--border-default)' }} />
            )}
          </div>

          <button className="btn btn-primary" onClick={handleSaveHero}><MdSave /> Save Hero Content</button>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="card glass-panel" style={{ maxWidth: '800px', padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Contact & Quick Stats Editor</h3>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Official Facebook Page URL</label>
            <input 
              type="url" 
              className="form-control" 
              value={contactForm.facebookLink} 
              onChange={e => setContactForm({ ...contactForm, facebookLink: e.target.value })} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Facebook Followers Text</label>
            <input 
              type="text" 
              className="form-control" 
              value={contactForm.facebookFollowers} 
              onChange={e => setContactForm({ ...contactForm, facebookFollowers: e.target.value })} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Full Address</label>
            <textarea 
              className="form-control" 
              rows={2}
              value={contactForm.location} 
              onChange={e => setContactForm({ ...contactForm, location: e.target.value })} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Short Location (for quick stats)</label>
            <input 
              type="text" 
              className="form-control" 
              value={contactForm.shortLocation} 
              onChange={e => setContactForm({ ...contactForm, shortLocation: e.target.value })} 
            />
          </div>

          <button className="btn btn-primary" onClick={handleSaveContact}><MdSave /> Save Contact Links</button>
        </div>
      )}

      {activeTab === 'officials' && (
        <div className="card glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>SK Officials Roster</h3>
            {!editingOfficialId && (
              <button 
                className="btn btn-primary" 
                onClick={() => { setEditingOfficialId('new'); setOfficialForm({ name: '', role: '', desc: '', icon: '👤' }); }}
              >
                <MdAdd /> Add Official
              </button>
            )}
          </div>

          {editingOfficialId && (
            <div style={{ background: 'var(--bg-elevated)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <h4 style={{ marginTop: 0 }}>{editingOfficialId === 'new' ? 'New Official' : 'Edit Official'}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" className="form-control" value={officialForm.name} onChange={e => setOfficialForm({...officialForm, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input type="text" className="form-control" value={officialForm.role} onChange={e => setOfficialForm({...officialForm, role: e.target.value})} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Description</label>
                <input type="text" className="form-control" value={officialForm.desc} onChange={e => setOfficialForm({...officialForm, desc: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Image URL or Upload (Background)</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="text" className="form-control" placeholder="https://... or click Upload" value={officialForm.icon} onChange={e => setOfficialForm({...officialForm, icon: e.target.value})} style={{ flex: 1 }} />
                  <input type="file" accept="image/*" id="official-image-upload" style={{ display: 'none' }} onChange={handleImageUpload} />
                  <label htmlFor="official-image-upload" className="btn btn-secondary" style={{ margin: 0, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Upload Image
                  </label>
                </div>
                {officialForm.icon && (officialForm.icon.startsWith('http') || officialForm.icon.startsWith('data:')) && (
                   <div style={{ marginTop: '0.5rem', width: '100px', height: '100px', borderRadius: '8px', background: `url(${officialForm.icon}) center/cover no-repeat` }} />
                )}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" onClick={handleSaveOfficial}>Save</button>
                <button className="btn btn-secondary" onClick={() => setEditingOfficialId(null)}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {(landingData?.officials || []).map(off => (
              <div key={off.id} style={{ 
                position: 'relative',
                border: '1px solid var(--border-default)', 
                borderRadius: '8px', 
                background: (off.icon && (off.icon.startsWith('http') || off.icon.startsWith('/') || off.icon.startsWith('data:'))) ? `url(${off.icon}) center/cover no-repeat` : '#1a1a2e',
                color: 'white',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                textAlign: 'center',
                overflow: 'hidden',
                padding: '1rem',
                paddingBottom: '1.5rem'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.9) 100%)', zIndex: 1 }} />
                
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 2, display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem', background: 'white' }} onClick={() => handleEditOfficial(off)}><MdEdit size={16} /></button>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem', background: 'white', color: 'var(--danger)' }} onClick={() => { if(window.confirm('Remove official?')) removeOfficial(off.id); }}><MdDelete size={16} /></button>
                </div>
                
                <div style={{ position: 'relative', zIndex: 2, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{off.name}</h4>
                  <div style={{ color: '#93c5fd', fontSize: '0.8rem', fontWeight: 600 }}>{off.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
