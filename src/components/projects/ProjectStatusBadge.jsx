import React from 'react';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '../../utils/constants';

export default function ProjectStatusBadge({ status, style = {} }) {
  const label = PROJECT_STATUS_LABELS[status] || status;
  const color = PROJECT_STATUS_COLORS[status] || 'var(--text-secondary)';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      background: `color-mix(in srgb, ${color} 15%, transparent)`,
      color: color,
      border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
      whiteSpace: 'nowrap',
      ...style
    }}>
      {label}
    </span>
  );
}
