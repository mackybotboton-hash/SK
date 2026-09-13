import React from 'react';

export default function SummaryCard({ title, value, icon: Icon, trend, trendLabel, color = 'var(--primary)' }) {
  return (
    <div className="card animate-fade-in-up" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', fontWeight: 600, fontFamily: 'var(--font-body)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</h3>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginTop: '0.25rem', letterSpacing: '-0.025em' }}>{value}</div>
        </div>
        <div style={{ 
          width: '42px', height: '42px', borderRadius: 'var(--radius-md)', 
          background: `color-mix(in srgb, ${color} 10%, transparent)`, 
          color: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.35rem',
          border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`
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
