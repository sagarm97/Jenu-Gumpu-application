import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ children, className, variant = 'default' }: { children: React.ReactNode, className?: string, variant?: 'default' | 'outline' | 'glass' }) {
  const variants = {
    default: "bg-white shadow-sm border border-brand-primary/5",
    outline: "bg-transparent border border-brand-primary/10",
    glass: "bg-white/40 backdrop-blur-md border border-white/20 shadow-xl shadow-brand-primary/5"
  };

  return (
    <div className={cn("rounded-3xl p-5", variants[variant], className)}>
      {children}
    </div>
  );
}

export function Badge({ children, className, variant = 'amber' }: { children: React.ReactNode, className?: string, variant?: 'amber' | 'emerald' | 'blue' | 'zinc' }) {
  const variants = {
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    zinc: "bg-zinc-100 text-zinc-700"
  };

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", variants[variant], className)}>
      {children}
    </span>
  );
}
