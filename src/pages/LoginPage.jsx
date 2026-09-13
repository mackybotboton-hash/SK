import React, { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { APP_CONFIG } from '../utils/constants';
import './LoginPage.css';

/**
 * LoginPage — Authenticates the user into SKHub.
 */
export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const { login, signup, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signup(email, password, fullName);
      } else {
        await login(email, password);
      }
      navigate('/', { replace: true });
    } catch (err) {
      // Error is caught and stored in auth state, displayed below.
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass-panel animate-fade-in-up">
        <div className="login-header">
          <div className="login-logo-container">
            <img src="/logo.png" alt="SK Diatagon Logo" className="login-logo-img" />
          </div>
          <h1>{APP_CONFIG.APP_NAME}</h1>
          <p>Barangay Diatagon SK Management System</p>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="fullName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
              <input 
                type="text" 
                id="fullName" 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required={isSignUp}
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
            <input 
              type="email" 
              id="email" 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem', position: 'relative' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                style={{ width: '100%', padding: '0.75rem', paddingRight: '2.5rem', borderRadius: '6px', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                tabIndex="-1"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginBottom: '1rem' }}
            disabled={loading}
          >
            {loading ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
          
          <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {isSignUp ? 'Already have an account? ' : 'Are you an official? '}
            <button 
              type="button" 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setEmail('');
                setPassword('');
                setFullName('');
              }}
              style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
