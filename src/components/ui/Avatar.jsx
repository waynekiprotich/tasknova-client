import React from 'react';
import { cn } from '../../utils/cn';

export function Avatar({ name, src, size = 'md', className }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg"
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center rounded-full bg-border p-[1px] shadow-sm flex-shrink-0", sizes[size], className)}>
      <div className="h-full w-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
        {src ? (
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="font-bold text-foreground">
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}
