import React from 'react';
import './Badge.css';

export function Badge({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: "badge-primary",
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
    info: "badge-info",
    neutral: "badge-neutral",
  };

  const badgeClass = `badge ${variants[variant] || variants.primary} ${className}`.trim();

  return (
    <span className={badgeClass}>
      {children}
    </span>
  );
}
