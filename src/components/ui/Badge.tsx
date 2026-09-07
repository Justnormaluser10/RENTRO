import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30',
    success: 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-950/70 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-950/70 text-rose-400 border-rose-500/30',
    info: 'bg-sky-950/70 text-sky-400 border-sky-500/30',
    neutral: 'bg-slate-800/80 text-slate-300 border-white/10',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
