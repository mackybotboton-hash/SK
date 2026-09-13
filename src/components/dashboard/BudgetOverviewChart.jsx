import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export default function BudgetOverviewChart({ data = [] }) {
  return (
    <div className="card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
        Budget Allocation vs. Expenses
      </h3>
      <div style={{ flex: 1, minHeight: '290px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 25, left: 15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
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
              cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
              contentStyle={{ 
                background: '#ffffff', 
                border: '1px solid var(--border-default)', 
                borderRadius: 'var(--radius-md)', 
                boxShadow: 'var(--shadow-md)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem'
              }}
              formatter={(value) => formatCurrency(value)}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '1rem', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }} 
            />
            <Bar 
              dataKey="allocated" 
              name="Allocated" 
              fill="#2563eb" 
              radius={[6, 6, 0, 0]} 
            />
            <Bar 
              dataKey="spent" 
              name="Spent" 
              fill="#f59e0b" 
              radius={[6, 6, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
