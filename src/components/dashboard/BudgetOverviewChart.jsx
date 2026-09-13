import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export default function BudgetOverviewChart({ data = [] }) {
  return (
    <div className="card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '1.125rem', fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
        Budget Allocation vs. Expenses
      </h3>
      <div style={{ flex: 1, minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              {/* Soft Blue Pastel Gradient for Allocated */}
              <linearGradient id="allocatedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7A9BBD" stopOpacity={1} />
                <stop offset="100%" stopColor="#5C7C9E" stopOpacity={0.85} />
              </linearGradient>

              {/* Soft Orange Pastel Gradient for Spent */}
              <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E8A87C" stopOpacity={1} />
                <stop offset="100%" stopColor="#D68B56" stopOpacity={0.85} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="var(--text-tertiary)" 
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12, fontFamily: 'var(--font-body)' }} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              stroke="var(--text-tertiary)" 
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12, fontFamily: 'var(--font-body)' }} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(value) => `₱${(value / 1000)}k`}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(63, 85, 120, 0.06)' }}
              contentStyle={{ 
                background: 'var(--bg-surface)', 
                border: '1px solid var(--border-default)', 
                borderRadius: 'var(--radius-md)', 
                boxShadow: 'var(--clay-shadow-outer-sm)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)'
              }}
              formatter={(value) => formatCurrency(value)}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '1rem', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }} 
            />
            <Bar 
              dataKey="allocated" 
              name="Allocated" 
              fill="url(#allocatedGradient)" 
              radius={[10, 10, 0, 0]} 
              style={{ filter: 'drop-shadow(2px 3px 4px rgba(51, 59, 77, 0.1))' }}
            />
            <Bar 
              dataKey="spent" 
              name="Spent" 
              fill="url(#spentGradient)" 
              radius={[10, 10, 0, 0]} 
              style={{ filter: 'drop-shadow(2px 3px 4px rgba(51, 59, 77, 0.1))' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
