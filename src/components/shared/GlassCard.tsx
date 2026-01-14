	//	Componente de card com efeito glass

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  isDark: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  isDark 
}) => (
  <div className={`rounded-3xl border shadow-sm transition-all overflow-hidden ${isDark ? 'bg-slate-800/40 border-slate-700/50 text-white' : 'bg-white/60 border-gray-100 text-gray-900'} glass ${className}`}>
    {children}
  </div>
);

export default GlassCard;