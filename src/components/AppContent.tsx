	//	Componente principal

import React from 'react';
import { useApp } from '../hooks/useApp';
import DashboardView from './views/DashboardView';
import ClientsView from './views/ClientsView';
import ClientDetailView from './views/ClientDetailView';
import ClientArchiveView from './views/ClientArchiveView';
import SettingsView from './views/SettingsView';
import Navigation from './shared/Navigation';
import ModalsContainer from './modals/ModalsContainer';

const AppContent: React.FC = () => {
  const { 
    view, 
    selectedClient, 
    isDark,
    
  } = useApp();

  // Função para renderizar a view atual
  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <DashboardView />;
      case 'clients':
        return <ClientsView />;
      case 'client-detail':
        return selectedClient ? <ClientDetailView /> : <ClientsView />;
      case 'client-archive':
        return selectedClient ? <ClientArchiveView /> : <ClientsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-0 md:p-4 lg:p-8 transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <div 
        className={`w-full h-full max-w-md md:max-w-lg md:h-[90vh] md:max-h-[1000px] md:rounded-[3.5rem] app-shadow flex flex-col transition-all overflow-hidden relative ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} border border-white/5`}
      >
        {/* Conteúdo principal */}
        <main className="flex-1 overflow-y-auto relative no-scrollbar">
          {renderView()}
        </main>
        
        {/* Navegação inferior (exceto em views de cliente) */}
        {!['client-detail', 'client-archive'].includes(view) && <Navigation />}
        
        {/* Container para todos os modais */}
        <ModalsContainer />
      </div>
    </div>
  );
};

export default AppContent;