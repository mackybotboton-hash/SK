import React from 'react';
import { MdEvent, MdLocationOn } from 'react-icons/md';

export default function UpcomingActivitiesWidget({ activities }) {
  return (
    <div className="card glass-panel" style={{ padding: '1.5rem', height: '100%' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
        Upcoming Schedules
      </h3>
      
      {activities.length === 0 ? (
        <div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '2rem 0' }}>
          No upcoming schedules.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activities.map(activity => (
            <div key={activity.id} style={{ 
              padding: '1rem', borderRadius: '8px', 
              border: '1px solid var(--border-default)', 
              background: 'var(--bg-elevated)'
            }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                {activity.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MdEvent size={16} /> {activity.date}
                </div>
                {activity.location && (
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MdLocationOn size={16} /> {activity.location}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
