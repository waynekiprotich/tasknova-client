import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
  const baseStyles = "clay-btn inline-flex items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary-500 text-primary-foreground hover:bg-primary-hover border border-primary-500 focus:ring-primary-500 shadow-md",
    secondary: "bg-surface text-foreground hover:bg-surface-hover border border-border focus:ring-border",
    ghost: "bg-transparent text-foreground hover:bg-surface focus:ring-border shadow-none",
    danger: "bg-danger text-white hover:bg-red-600 border border-red-500/50 focus:ring-red-500 shadow-md shadow-danger/20",
  };
  
  const sizes = {
    sm: "h-10 px-4 text-sm",
    md: "h-12 px-6 text-sm",
    lg: "h-14 px-8 text-base",
    icon: "h-12 w-12",
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ y: -1 }}
      whileTap={{ y: 1, scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";
