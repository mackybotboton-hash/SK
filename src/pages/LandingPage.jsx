import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdLogin, MdLocationOn, MdPeople, MdAccountBalance, 
  MdVerified, MdOpenInNew, MdPhone, MdEmail, MdFolderSpecial 
} from 'react-icons/md';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  const officials = [
    { name: 'SK Chairperson', role: 'Executive Head & Ex-Officio Member', desc: 'Leads the SK Council, presides over youth policy & budget authorizations.', icon: '👑' },
    { name: 'SK Secretary', role: 'Records & Communications', desc: 'Maintains official minutes, resolution archives, and public notices.', icon: '📜' },
    { name: 'SK Treasurer', role: 'Financial Management', desc: 'Manages the 10% SK Fund allocations, statutory limits, and financial reports.', icon: '⚖️' },
    { name: 'SK Kagawad (Youth Welfare)', role: 'Committee Chair', desc: 'Oversees youth health, wellness, and social development programs.', icon: '🌱' },
    { name: 'SK Kagawad (Sports & Culture)', role: 'Committee Chair', desc: 'Organizes sports festivals, cultural activities, and youth tournaments.', icon: '🏆' },
    { name: 'SK Kagawad (Education & Tech)', role: 'Committee Chair', desc: 'Drives educational assistance, digital literacy, and skill workshops.', icon: '🎓' }
  ];

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

          <button className="btn btn-primary landing-login-btn" onClick={() => navigate('/login')}>
            <MdLogin size={18} /> Official Portal Login
          </button>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="landing-hero">
        <div className="landing-hero-bg" />
        <div className="landing-container landing-hero-content">
          <div className="landing-hero-badge">
            <MdVerified size={16} /> Official Portal — Sangguniang Kabataan Diatagon
          </div>
          
          <h1 className="landing-hero-title">
            Empowering the Youth of <span className="text-highlight">Barangay Diatagon</span>
          </h1>

          <p className="landing-hero-desc">
            Welcome to the centralized monitoring portal for Barangay Diatagon, Lianga, Surigao del Sur. 
            Streamlining SK project proposals, 10% Barangay General Fund management, and youth development records.
          </p>

          <div className="landing-hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
              <MdLogin size={20} /> Access Portal Login
            </button>
            <a 
              href="https://www.facebook.com/sk.diatagon" 
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
                <div className="landing-stat-val">1.5K+</div>
                <div className="landing-stat-lbl">Facebook Followers</div>
              </div>
            </div>

            <div className="landing-stat-card">
              <div className="landing-stat-icon"><MdLocationOn size={24} /></div>
              <div>
                <div className="landing-stat-val">Purok 2</div>
                <div className="landing-stat-lbl">Diatagon, Lianga, Surigao del Sur</div>
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
            {officials.map((official, idx) => (
              <div key={idx} className="card official-card">
                <div className="official-avatar-placeholder">
                  <span className="official-emoji">{official.icon}</span>
                </div>
                <h3 className="official-title">{official.name}</h3>
                <div className="official-role">{official.role}</div>
                <p className="official-desc">{official.desc}</p>
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
                    <div>Purok 2, Diatagon, Lianga, Surigao del Sur, 8307</div>
                  </div>
                </div>

                <div className="contact-item">
                  <MdOpenInNew size={22} className="contact-icon" />
                  <div>
                    <strong>Facebook Page:</strong>
                    <div>
                      <a href="https://www.facebook.com/sk.diatagon" target="_blank" rel="noopener noreferrer">
                        facebook.com/sk.diatagon (1.5K Followers)
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
