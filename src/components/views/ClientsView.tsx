	//   ClientsView.tsx

import React from 'react';
import { Search, UserPlus } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

const ClientsView: React.FC = () => {
  const {
    isDark,
    t,
    filteredClients,
    searchQuery,
    setSearchQuery,
    getClientBalance,
    settings,
    setSelectedClientId,
    setView,
    setShowAddClient
  } = useApp();

  return (
    <div className="p-6 pb-24 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder={t.client_search} 
            className={`w-full pl-12 pr-14 py-3 rounded-2xl border-none focus:ring-2 shadow-sm transition-all ${isDark ? 'bg-slate-800 text-white placeholder:text-slate-600' : 'bg-white text-slate-900'}`}
            style={{ "--tw-ring-color": settings.uiConfig.primaryColor } as any}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => setShowAddClient(true)}
            title="Adicionar cliente"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg shadow-md flex items-center justify-center hover:brightness-110 active:scale-95"
            style={{ backgroundColor: settings.uiConfig.primaryColor, color: '#fff' }}
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid gap-3">
        {filteredClients.length > 0 ? (
          filteredClients.map(client => {
            const balance = getClientBalance(client);
            return (
              <div 
                key={client.id} 
                className={`p-4 md:p-5 rounded-[2rem] shadow-sm border flex justify-between items-center active:scale-[0.98] transition-all cursor-pointer ${isDark ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
                onClick={() => { 
                  setSelectedClientId(client.id); 
                  setView('client-detail'); 
                }}
              >
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                  <div 
                    className={`w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-2xl flex items-center justify-center font-bold text-base md:text-lg ${isDark ? 'bg-slate-700' : 'bg-blue-100'}`}
                    style={{ color: settings.uiConfig.primaryColor }}
                  >
                    {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className={`font-extrabold text-sm md:text-base truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {client.name}
                    </h4>
                    <p className="text-[10px] md:text-xs text-slate-500 font-bold tracking-tight mt-0.5 truncate">
                      {client.phone}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className={`font-black text-base md:text-lg ${balance > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {balance > 0 ? '-' : ''}{Math.abs(balance).toLocaleString()}
                  </p>
                  <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                    {t.client_balance_label}
                  </p>
                </div>
              </div>
            );
          })
        ) : searchQuery ? (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <button 
              onClick={() => setShowAddClient(true)}
              className={`w-full p-8 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all active:scale-95 ${isDark ? 'border-slate-800 bg-slate-800/20 text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}
            >
              <UserPlus className="w-10 h-10 opacity-40" />
              <div className="text-center">
                <p className="font-bold text-base">Cliente não encontrado</p>
                <p className="text-xs opacity-60">
                  Deseja cadastrar <span className="text-blue-500 font-black">"{searchQuery}"</span>?
                </p>
              </div>
            </button>
          </div>
        ) : (
          <div className="py-20 text-center opacity-30 italic font-medium text-sm">
            Nenhum cliente com saldo pendente
          </div>
        )}
      </div>
      
      {/* Botão flutuante removido: agora o botão de adicionar está fixo no final da barra de pesquisa */}
    </div>
  );
};

export default ClientsView;