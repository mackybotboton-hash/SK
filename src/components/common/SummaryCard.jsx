import React from 'react';

export default function SummaryCard({ title, value, icon: Icon, trend, trendLabel, color = 'var(--primary)' }) {
  return (
    <div className="card animate-fade-in-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', fontWeight: 600, fontFamily: 'var(--font-body)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</h3>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginTop: '0.35rem' }}>{value}</div>
        </div>
        <div style={{ 
          width: '46px', height: '46px', borderRadius: 'var(--radius-md)', 
          background: `color-mix(in srgb, ${color} 14%, transparent)`, 
          color: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem',
          boxShadow: 'var(--clay-shadow-outer-sm), var(--clay-shadow-inner)'
        }}>
          {Icon && <Icon />}
        </div>
      </div>
      {trend !== undefined && (
        <div style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ 
            color: trend > 0 ? 'var(--success)' : 'var(--danger)', 
            fontWeight: 700, display: 'flex', alignItems: 'center' 
          }}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span style={{ color: 'var(--text-muted)' }}>{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
