import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdLogin, MdLocationOn, MdPeople, MdAccountBalance, 
  MdVerified, MdOpenInNew, MdPhone, MdEmail, MdFolderSpecial,
  MdMenu, MdClose, MdInfo, MdGroup, MdContacts
} from 'react-icons/md';
import useLandingPageManager from '../hooks/useLandingPageManager';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const { landingData } = useLandingPageManager();

  return (
    <div className="landing-page">
      {/* ── Top Navbar ── */}
      <header className="landing-navbar">
        <div className="landing-container landing-nav-content">
          <div className="landing-brand">
            <img src="/logo.png" alt="SK Diatagon Logo" className="landing-logo-img" />
            <div className="landing-brand-text">
              <span className="landing-brand-title">SKHub</span>
              <span className="landing-brand-sub">Barangay Diatagon</span>
            </div>
          </div>

          <div className="landing-nav-links hide-mobile">
            <a href="#about" className="landing-nav-item">About</a>
            <a href="#officials" className="landing-nav-item">SK Officials</a>
            <a href="#contact" className="landing-nav-item">Contact & Location</a>
          </div>


          {/* Mobile hamburger toggle — only visible on phone */}
          <button className="landing-mobile-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {mobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Menu Drawer ── */}
      <div className={`landing-mobile-menu${mobileMenuOpen ? ' open' : ''}`}>
        <a href="#about" className="landing-mobile-link" onClick={closeMobileMenu}>
          <MdInfo size={20} /> About
        </a>
        <a href="#officials" className="landing-mobile-link" onClick={closeMobileMenu}>
          <MdGroup size={20} /> SK Officials
        </a>
        <a href="#contact" className="landing-mobile-link" onClick={closeMobileMenu}>
          <MdContacts size={20} /> Contact & Location
        </a>
      </div>

      {/* ── Hero Section ── */}
      <section className="landing-hero">
        <div className="landing-hero-bg" />
        <div className="landing-container landing-hero-content">
          <div className="landing-hero-badge">
            <MdVerified size={16} /> Official Portal — Sangguniang Kabataan Diatagon
          </div>
          
          <h1 className="landing-hero-title" dangerouslySetInnerHTML={{ __html: landingData?.heroTitle || '' }} />

          <p className="landing-hero-desc">
            {landingData.heroDesc}
          </p>

          <div className="landing-hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
              <MdLogin size={20} /> Access Portal Login
            </button>
            <a 
              href={landingData.facebookLink} 
              target="_blank" 

              rel="noopener noreferrer" 
              className="btn btn-secondary btn-lg"
            >
              <MdOpenInNew size={20} /> Official Facebook Page
            </a>
          </div>

          {/* Official SK Officials Group Photo Showcase */}
          <div className="landing-officials-photo-container">
            <div className="landing-officials-photo-wrapper card">
              <img 
                src="/sk-officials.png" 
                alt="Sangguniang Kabataan Barangay Diatagon Officials" 
                className="landing-officials-hero-img"
              />
              <div className="landing-officials-photo-caption">
                <MdVerified size={18} className="text-primary-color" />
                <span>Sangguniang Kabataan Council — Barangay Diatagon, Lianga, Surigao del Sur</span>
              </div>
            </div>
          </div>

          {/* Social & Location Quick Stats */}
          <div className="landing-stats-grid">
            <div className="landing-stat-card">
              <div className="landing-stat-icon"><MdPeople size={24} /></div>
              <div>
                <div className="landing-stat-val">{landingData.facebookFollowers}</div>
                <div className="landing-stat-lbl">Facebook Followers</div>
              </div>
            </div>

            <div className="landing-stat-card">
              <div className="landing-stat-icon"><MdLocationOn size={24} /></div>
              <div>
                <div className="landing-stat-val">{landingData.shortLocation}</div>
                <div className="landing-stat-lbl">Lianga, Surigao del Sur</div>
              </div>
            </div>

            <div className="landing-stat-card">
              <div className="landing-stat-icon"><MdAccountBalance size={24} /></div>
              <div>
                <div className="landing-stat-val">10% SK Fund</div>
                <div className="landing-stat-lbl">Barangay Allocation Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section id="about" className="landing-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <h2 className="heading-section">Internal Management & Youth Governance</h2>
            <p className="text-small">Built specifically for the SK Council of Barangay Diatagon</p>
          </div>

          <div className="landing-features-grid">
            <div className="card feature-card">
              <div className="feature-icon"><MdFolderSpecial size={28} /></div>
              <h3>Project Monitoring</h3>
              <p>Tracking CBYDP & ABYIP Youth Programs from initial proposal to execution and post-activity reports.</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon"><MdAccountBalance size={28} /></div>
              <h3>Budget Accountability</h3>
              <p>Ensuring 100% compliance with statutory limits (Personal Services 25%, Mandatory Training 15%).</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon"><MdVerified size={28} /></div>
              <h3>Resolution Archives</h3>
              <p>Centralized repository for official SK Resolutions, minutes, and Barangay Council submissions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SK Officials Roster Section ── */}
      <section id="officials" className="landing-section bg-alt">
        <div className="landing-container">
          <div className="section-header text-center">
            <h2 className="heading-section">Sangguniang Kabataan Officials</h2>
            <p className="text-small">Barangay Diatagon, Lianga, Surigao del Sur</p>
          </div>

          <div className="officials-grid">
            {(landingData?.officials || []).map((official, idx) => (
              <div key={idx} className="card official-card" style={{ 
                position: 'relative',
                background: (official.icon && (official.icon.startsWith('http') || official.icon.startsWith('/') || official.icon.startsWith('data:'))) ? `url(${official.icon}) center/cover no-repeat` : '#1a1a2e',
                color: 'white',
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                textAlign: 'center',
                overflow: 'hidden',
                padding: '1.5rem',
                paddingBottom: '2rem',
                border: 'none'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.9) 100%)', zIndex: 1 }} />
                <div style={{ position: 'relative', zIndex: 2, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  <h3 className="official-title" style={{ color: 'white', marginBottom: '0.25rem', fontSize: '1.25rem' }}>{official.name}</h3>
                  <div className="official-role" style={{ color: '#93c5fd', fontSize: '0.9rem', margin: 0 }}>{official.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact & Location Section ── */}
      <section id="contact" className="landing-section">
        <div className="landing-container">
          <div className="card contact-card">
            <div className="contact-info-col">
              <h2 className="heading-section">Connect with SK Diatagon</h2>
              <p className="text-body" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                For official inquiries, community concerns, or youth program partnerships:
              </p>

              <div className="contact-list">
                <div className="contact-item">
                  <MdLocationOn size={22} className="contact-icon" />
                  <div>
                    <strong>Office Location:</strong>
                    <div>{landingData.location}</div>
                  </div>
                </div>

                <div className="contact-item">
                  <MdOpenInNew size={22} className="contact-icon" />
                  <div>
                    <strong>Facebook Page:</strong>
                    <div>
                      <a href={landingData.facebookLink} target="_blank" rel="noopener noreferrer">
                        {landingData.facebookLink.replace('https://www.', '')} ({landingData.facebookFollowers} Followers)
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-cta-col">
              <div className="cta-box">
                <img src="/logo.png" alt="SK Diatagon Logo" className="cta-logo" />
                <h3>SK Official Portal</h3>
                <p>Are you an SK Official of Barangay Diatagon? Log in to manage project budgets & records.</p>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
                  <MdLogin size={20} /> Open SKHub Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-container footer-content">
          <div className="footer-brand">
            <img src="/logo.png" alt="Logo" className="footer-logo" />
            <div>
              <strong>SKHub — Barangay Diatagon</strong>
              <div className="text-caption">Lianga, Surigao del Sur</div>
            </div>
          </div>
          <div className="footer-copy">
            © 2026 Sangguniang Kabataan - Diatagon. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
