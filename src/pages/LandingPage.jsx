import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdLogin, MdLocationOn, MdPeople, MdAccountBalance,
  MdVerified, MdOpenInNew, MdFolderSpecial,
  MdMenu, MdClose, MdInfo, MdGroup, MdContacts
} from 'react-icons/md';
import useLandingPageManager from '../hooks/useLandingPageManager';
import './LandingPage.css';

/* ── Helpers ── */

/** Parse a string like "1.5K+" into { num: 1500, suffix: "K+" } — or null if no number. */
function parseStatValue(str) {
  if (!str) return null;
  const match = str.match(/^([\d,.]+)\s*(.*)/);
  if (!match) return null;
  const raw = match[1].replace(/,/g, '');
  const num = parseFloat(raw);
  if (isNaN(num)) return null;
  return { num, suffix: match[2] || '' };
}

/** Returns true if reduced motion is preferred. */
function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/* ── Component ── */

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  // Refs
  const photoCardRef = useRef(null);
  const statsRef = useRef(null);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [statDisplays, setStatDisplays] = useState([]);

  const { landingData } = useLandingPageManager();

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // ── Scroll: progress bar + navbar shadow ──
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setScrolled(scrollTop > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Active section tracking ──
  useEffect(() => {
    const sections = document.querySelectorAll('#about, #officials, #contact');
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // ── Scroll-triggered reveals ──
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || '0';
            entry.target.style.transitionDelay = `${delay}ms`;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── Stats count-up ──
  const STAT_ITEMS = [
    { value: landingData?.facebookFollowers || '0', label: 'Facebook Followers' },
    { value: landingData?.shortLocation || 'Purok 2', label: 'Lianga, Surigao del Sur' },
    { value: '10%', label: 'SK Fund Allocation' },
  ];

  useEffect(() => {
    setStatDisplays(STAT_ITEMS.map(s => s.value));
  }, [landingData?.facebookFollowers, landingData?.shortLocation]);

  useEffect(() => {
    if (prefersReducedMotion() || statsAnimated) return;
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsAnimated(true);
          observer.disconnect();
          animateCountUp();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [statsAnimated]);

  const animateCountUp = useCallback(() => {
    const duration = 1200;
    const start = performance.now();

    const parsed = STAT_ITEMS.map(s => parseStatValue(s.value));

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      const newDisplays = STAT_ITEMS.map((s, i) => {
        const p = parsed[i];
        if (!p) return s.value;
        const current = Math.round(p.num * eased * 10) / 10;
        // Format nicely: if original had decimal, keep it
        const formatted = p.num >= 1000
          ? current.toFixed(1).replace(/\.0$/, '')
          : String(Math.round(current));
        return formatted + p.suffix;
      });
      setStatDisplays(newDisplays);

      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  // ── Cursor tilt on hero photo ──
  const handlePhotoMouseMove = useCallback((e) => {
    if (prefersReducedMotion()) return;
    const card = photoCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  }, []);

  const handlePhotoMouseLeave = useCallback(() => {
    const card = photoCardRef.current;
    if (card) card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
  }, []);

  // ── Helpers for officials background ──
  const getOfficialBg = (icon) => {
    if (icon && (icon.startsWith('http') || icon.startsWith('/') || icon.startsWith('data:'))) {
      return `url(${icon}) center/cover no-repeat`;
    }
    return 'linear-gradient(135deg, #122244 0%, #0a1930 100%)';
  };

  return (
    <div className="landing-page">
      {/* ── Scroll Progress Bar ── */}
      <div className="landing-scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* ── Top Navbar ── */}
      <header className={`landing-navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="landing-container landing-nav-content">
          <div className="landing-brand">
            <img src="/logo.png" alt="SK Diatagon Logo" className="landing-logo-img" />
            <div className="landing-brand-text">
              <span className="landing-brand-title">SKHub</span>
              <span className="landing-brand-sub">Barangay Diatagon</span>
            </div>
          </div>

          <div className="landing-nav-links hide-mobile">
            <a href="#about" className={`landing-nav-item${activeSection === 'about' ? ' active' : ''}`}>About</a>
            <a href="#officials" className={`landing-nav-item${activeSection === 'officials' ? ' active' : ''}`}>SK Officials</a>
            <a href="#contact" className={`landing-nav-item${activeSection === 'contact' ? ' active' : ''}`}>Contact</a>
            <button className="landing-nav-login" onClick={() => navigate('/login')}>
              <MdLogin size={16} /> Login
            </button>
          </div>

          <button className="landing-mobile-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {mobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Menu Drawer ── */}
      <div className={`landing-mobile-menu${mobileMenuOpen ? ' open' : ''}`}>
        <a href="#about" className={`landing-mobile-link${activeSection === 'about' ? ' active' : ''}`} onClick={closeMobileMenu}>
          <MdInfo size={20} /> About
        </a>
        <a href="#officials" className={`landing-mobile-link${activeSection === 'officials' ? ' active' : ''}`} onClick={closeMobileMenu}>
          <MdGroup size={20} /> SK Officials
        </a>
        <a href="#contact" className={`landing-mobile-link${activeSection === 'contact' ? ' active' : ''}`} onClick={closeMobileMenu}>
          <MdContacts size={20} /> Contact
        </a>
        <button className="landing-mobile-link landing-mobile-login" onClick={() => { closeMobileMenu(); navigate('/login'); }}>
          <MdLogin size={20} /> Login to Portal
        </button>
      </div>

      {/* ── Hero Section ── */}
      <section className="landing-hero">
        <div className="landing-deco landing-deco-1" />
        <div className="landing-deco landing-deco-2" />
        <div className="landing-container">
          <div className="landing-hero-grid">
            {/* Left: Copy */}
            <div className="landing-hero-copy">
              <div className="landing-hero-badge">
                <MdVerified size={16} /> Official Portal — Sangguniang Kabataan
              </div>

              <h1 className="landing-hero-title" dangerouslySetInnerHTML={{ __html: landingData?.heroTitle || '' }} />

              <p className="landing-hero-desc">
                {landingData?.heroDesc || ''}
              </p>

              <div className="landing-hero-actions">
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
                  <MdLogin size={20} /> Access Portal
                </button>
                <a
                  href={landingData?.facebookLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-lg"
                >
                  <MdOpenInNew size={20} /> Facebook Page
                </a>
              </div>
            </div>

            {/* Right: Photo */}
            <div className="landing-hero-photo">
              <div
                className="landing-hero-photo-card"
                ref={photoCardRef}
                onMouseMove={handlePhotoMouseMove}
                onMouseLeave={handlePhotoMouseLeave}
              >
                <img
                  src="/sk-officials.png"
                  alt="Sangguniang Kabataan Barangay Diatagon Officials"
                  className="landing-officials-hero-img"
                />
                <div className="landing-officials-photo-caption">
                  <MdVerified size={16} className="text-primary-color" />
                  <span>SK Council — Barangay Diatagon, Lianga</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="landing-stats-strip" ref={statsRef}>
        <div className="landing-container">
          <div className="landing-stats-inner">
            {STAT_ITEMS.map((stat, i) => (
              <div className="landing-stat-item" key={i}>
                <div className="landing-stat-val">{statDisplays[i] || stat.value}</div>
                <div className="landing-stat-lbl">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section id="about" className="landing-section">
        <div className="landing-container">
          <div className="section-header text-center reveal" data-delay="0">
            <div className="landing-section-label">
              <MdInfo size={14} /> About the Platform
            </div>
            <h2 className="heading-section">Internal Management & Youth Governance</h2>
            <p className="text-small">Built specifically for the SK Council of Barangay Diatagon</p>
          </div>

          <div className="landing-bento">
            <div className="card feature-card bento-large reveal" data-delay="100">
              <div className="feature-icon"><MdFolderSpecial size={28} /></div>
              <h3>Project Monitoring</h3>
              <p>Tracking CBYDP & ABYIP Youth Programs from initial proposal to execution and post-activity reports. Full lifecycle management with real-time status updates and automated compliance checks.</p>
            </div>

            <div className="card feature-card reveal" data-delay="200">
              <div className="feature-icon"><MdAccountBalance size={28} /></div>
              <h3>Budget Accountability</h3>
              <p>Ensuring 100% compliance with statutory limits (Personal Services 25%, Mandatory Training 15%).</p>
            </div>

            <div className="card feature-card reveal" data-delay="300">
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
          <div className="section-header text-center reveal" data-delay="0">
            <div className="landing-section-label">
              <MdGroup size={14} /> Leadership
            </div>
            <h2 className="heading-section">Sangguniang Kabataan Officials</h2>
            <p className="text-small">Barangay Diatagon, Lianga, Surigao del Sur</p>
          </div>

          <div className="officials-grid">
            {(landingData?.officials || []).map((official, idx) => (
              <div
                key={official.id || idx}
                className={`card official-card reveal${idx === 0 ? ' official-spotlight' : ''}`}
                data-delay={idx * 100}
                style={{
                  background: getOfficialBg(official.icon),
                  color: 'white',
                }}
              >
                <div className="official-overlay" />
                <div className="official-text-block">
                  <h3 className="official-title">{official.name}</h3>
                  <div className="official-role">{official.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact & Location Section ── */}
      <section id="contact" className="landing-section">
        <div className="landing-container">
          <div className="card contact-card reveal" data-delay="0">
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
                    <div>{landingData?.location || ''}</div>
                  </div>
                </div>

                <div className="contact-item">
                  <MdOpenInNew size={22} className="contact-icon" />
                  <div>
                    <strong>Facebook Page:</strong>
                    <div>
                      <a href={landingData?.facebookLink || '#'} target="_blank" rel="noopener noreferrer">
                        {(landingData?.facebookLink || '').replace('https://www.', '')} ({landingData?.facebookFollowers || ''} Followers)
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
              <div className="text-caption" style={{ color: 'rgba(255,255,255,0.5)' }}>Lianga, Surigao del Sur</div>
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
