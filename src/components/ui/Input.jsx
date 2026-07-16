import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(({ className, label, error, icon: Icon, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "clay-input flex h-12 w-full px-4 py-2 text-sm text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary disabled:cursor-not-allowed disabled:opacity-50",
            Icon && "pl-11",
            error && "border-danger focus-visible:ring-danger",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 ml-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";
