import React from 'react';
import * as Icons from 'react-icons/md';

export default function RecentActivityWidget({ activities }) {
  return (
    <div className="card glass-panel" style={{ padding: '1.5rem', height: '100%' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
        Recent Activity
      </h3>
      
      {activities.length === 0 ? (
        <div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '2rem 0' }}>
          No recent activity found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {activities.map(activity => {
            const Icon = Icons[activity.icon] || Icons.MdHistory;
            return (
              <div key={activity.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '36px', height: '36px', borderRadius: '50%', 
                  background: `color-mix(in srgb, ${activity.color || 'var(--primary)'} 15%, transparent)`, 
                  color: activity.color || 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                }}>
                  <Icon size={18} />
                </div>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    {activity.action}
                  </div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
