import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Soft Navy & Gold Clay Palette for Slices
const COLORS = ['#3F5578', '#C9A15C', '#6B9A82', '#6289B5', '#D99B56'];

export default function ProjectStatusChart({ data = [] }) {
  const totalProjects = data.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <div className="card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <h3 style={{ fontSize: '1.125rem', fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
        Project Status Distribution
      </h3>

      <div style={{ flex: 1, minHeight: '260px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Subtle Sheen Overlay */}
        <div style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.45) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 2
        }} />

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
          <div style={{ fontSize: '1.65rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {totalProjects}
          </div>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Projects
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={8}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  style={{ filter: 'drop-shadow(2px 3px 6px rgba(51, 59, 77, 0.15))' }}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                background: 'var(--bg-surface)', 
                border: '1px solid var(--border-default)', 
                borderRadius: 'var(--radius-md)', 
                boxShadow: 'var(--clay-shadow-outer-sm)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)'
              }}
              formatter={(val, name) => [`${val} Projects`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with Per-Category Numbers */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.25rem', justifyContent: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-default)' }}>
        {data.map((entry, index) => (
          <div key={entry.name || index} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
            <span style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              backgroundColor: COLORS[index % COLORS.length],
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
            }} />
            <span>{entry.name}:</span>
            <strong style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 700 }}>{entry.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
