import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Sleek Modern Colors
const COLORS = ['#2563EB', '#F59E0B', '#10B981', '#6366F1', '#EC4899'];

export default function ProjectStatusChart({ data = [] }) {
  const totalProjects = data.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <div className="card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
        Project Status Distribution
      </h3>

      <div style={{ flex: 1, minHeight: '250px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Donut Center Total Label */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 3
        }}>
          <div style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {totalProjects}
          </div>
          <div style={{ fontSize: '0.725rem', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.2rem' }}>
            Projects
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={92}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                background: '#ffffff', 
                border: '1px solid var(--border-default)', 
                borderRadius: 'var(--radius-md)', 
                boxShadow: 'var(--shadow-md)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem'
              }}
              formatter={(val, name) => [`${val} Projects`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with Numbers */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem 1.25rem', justifyContent: 'center', marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-light)' }}>
        {data.map((entry, index) => (
          <div key={entry.name || index} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: COLORS[index % COLORS.length]
            }} />
            <span>{entry.name}:</span>
            <strong style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 700 }}>{entry.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
