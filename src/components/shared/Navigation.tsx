	//	Navigation.tsx

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings as SettingsIcon 
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { hexToRgba } from '../../utils/helpers';

const Navigation: React.FC = () => {
  const { 
    view, 
    setView, 
    isDark, 
    settings, 
    t 
  } = useApp();

  const navItems = [
    { v: 'dashboard', icon: <LayoutDashboard />, label: t.nav_home },
    { v: 'clients', icon: <Users />, label: t.nav_clients },
    { v: 'settings', icon: <SettingsIcon />, label: t.nav_settings }
  ];

  return (
    <nav className={`h-24 safe-bottom flex items-center justify-around px-4 md:px-12 z-40 border-t ${isDark ? 'bg-slate-900/80 border-white/5' : 'bg-white/80 border-slate-100'} backdrop-blur-2xl`}>
      {navItems.map((item, i) => {
        const isActive = view === item.v;
        
        return (
          <button 
            key={i} 
            onClick={() => setView(item.v as any)}
            className={`flex flex-col items-center gap-2 transition-all group ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
            style={{ color: isActive ? settings.uiConfig.primaryColor : undefined }}
          >
            <div 
              className={`p-2 rounded-2xl transition-all group-active:scale-90 ${isActive ? 'scale-110' : ''}`}
              style={{ 
                backgroundColor: isActive 
                  ? hexToRgba(settings.uiConfig.primaryColor, 0.1) 
                  : undefined 
              }}
            >
              {React.cloneElement(item.icon as React.ReactElement<any>, { 
                className: 'w-5 h-5 md:w-6 md:h-6', 
                strokeWidth: isActive ? 3 : 2 
              })}
            </div>
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] opacity-80">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;