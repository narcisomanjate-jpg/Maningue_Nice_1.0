	//	ClientDetailView.tsx

import React from 'react';
import { 
  Phone, 
  MessageSquare, 
  History, 
  FileText,
  ChevronLeft,
  Edit2,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  MoreVertical,
  Send
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { formatTime } from '../../utils/helpers';

const ClientDetailView: React.FC = () => {
  const {
    isDark,
    settings,
    selectedClient,
    getClientBalance,
    setView,
    setShowEditClient,
    setShowTransactionModal,
    setShowSMSOptionsModal,
    handleCloseAccount,
    handleTransactionClick,
    setSelectedTransactionForOptions,
    selectedTransactionForOptions,
    setEditingTransaction,
    setShowEditTransactionModal,
    handleSendTransactionConfirmation
  } = useApp();

  if (!selectedClient) {
    return null;
  }

  const balance = getClientBalance(selectedClient);

  return (
    <div className="min-h-full flex flex-col animate-in slide-in-from-right-10 duration-500 no-scrollbar">
      {/* Cabeçalho fixo */}
      <div 
        className="p-8 pt-12 pb-8 rounded-b-[3.5rem] text-white relative shadow-2xl sticky top-0 z-30"
        style={{ backgroundColor: settings.uiConfig.primaryColor }}
      >
        <button 
          onClick={() => setView('clients')}
          className="absolute left-6 top-12 p-2 md:p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        
        <button 
          onClick={() => setShowEditClient(true)}
          className="absolute right-6 top-12 p-2 md:p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all"
        >
          <Edit2 className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        
        <div className="flex flex-col items-center mt-2">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/15 backdrop-blur-md rounded-[2rem] flex items-center justify-center text-2xl md:text-3xl font-black mb-3">
            {selectedClient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-center px-4 truncate max-w-full">
            {selectedClient.name}
          </h2>
          
          <p className="opacity-70 text-xs md:text-sm font-bold mt-1">
            {selectedClient.phone}
          </p>
          
          <div className="grid grid-cols-4 gap-2 md:gap-4 w-full px-2 md:px-4 mt-6">
            {[
              {icon: <Phone />, label: 'Ligar', action: () => window.open(`tel:${selectedClient.phone}`, '_blank')}, 
              {icon: <MessageSquare />, label: 'Cobrar', action: () => setShowSMSOptionsModal(true)}, 
              {icon: <History />, label: 'Arquivo', action: () => setView('client-archive')}, 
              {icon: <FileText />, label: 'Fechar', action: () => handleCloseAccount(selectedClient)}
            ].map((btn, i) => (
              <button 
                key={i} 
                onClick={btn.action}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/15 rounded-2xl flex items-center justify-center text-white shadow-xl group-active:scale-90 transition-all">
                  {React.cloneElement(btn.icon as React.ReactElement<any>, { 
                    className: 'w-4 h-4 md:w-5 md:h-5' 
                  })}
                </div>
                <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest opacity-80">
                  {btn.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Área rolável das transações */}
      <div className="flex-1 px-4 md:px-6 pt-6 pb-32 space-y-6 overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-end mb-4 sticky top-0 z-20 bg-inherit pt-2">
          <h3 className={`font-black uppercase tracking-widest text-[10px] md:text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Conta Ativa
          </h3>
          <div className="text-right">
            <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Saldo
            </p>
            <p className={`text-xl md:text-2xl font-black ${balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {balance.toLocaleString()} 
              <span className="text-xs font-bold"> {settings.currency}</span>
            </p>
          </div>
        </div>
        
        {selectedClient.activeAccount.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center opacity-40">
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <p className="font-bold text-sm">Nenhum lançamento</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedClient.activeAccount.map(tx => (
              <div 
                key={tx.id} 
                className={`p-4 rounded-[2rem] border shadow-sm flex items-center justify-between transition-all relative ${isDark ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
                onClick={() => handleTransactionClick(tx.id)}
              >
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                  <div className={`w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-2xl flex items-center justify-center ${tx.type === 'Inflow' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {tx.type === 'Inflow' ? (
                      <ArrowDownLeft className="w-5 h-5 md:w-6 md:h-6" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 md:w-6 md/h-6" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className={`font-black text-xs md:text-sm uppercase truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {tx.description || tx.type}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate">
                        {tx.method}
                      </p>
                      <span className="text-slate-300">•</span>
                      <p className="text-[9px] md:text-[10px] text-slate-400 font-bold tracking-tighter truncate">
                        {new Date(tx.date).toLocaleDateString()} • {formatTime(tx.date)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2 flex items-center gap-2">
                  <p className={`font-black text-sm md:text-base ${tx.type === 'Inflow' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {tx.type === 'Inflow' ? '+' : '-'}{tx.amount.toLocaleString()}
                  </p>
                  <button 
                    className="p-1 hover:bg-slate-200/20 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTransactionForOptions(
                        selectedTransactionForOptions === tx.id ? null : tx.id
                      );
                    }}
                  >
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                
                {/* Menu de opções da transação */}
                {selectedTransactionForOptions === tx.id && (
                  <div className={`absolute right-4 top-16 z-10 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'}`}>
                    <div className="p-2 space-y-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTransaction(tx);
                          setShowEditTransactionModal(true);
                          setSelectedTransactionForOptions(null);
                        }}
                        className="w-full p-3 rounded-xl text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="text-sm font-bold">Editar</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendTransactionConfirmation(tx);
                          setSelectedTransactionForOptions(null);
                        }}
                        className="w-full p-3 rounded-xl text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        <span className="text-sm font-bold">Enviar Confirmação</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Botões de ação */}
      <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-12 md:bottom-32 md:flex-col md:w-auto md:gap-4 flex gap-3 z-10">
        <button 
          onClick={() => setShowTransactionModal({ show: true, type: 'Outflow' })}
          className="bg-rose-600 text-white p-4 md:p-5 rounded-[2rem] font-black text-sm md:text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2 flex-1 md:flex-none md:min-w-[140px]"
        >
          <Plus className="w-5 h-5 md:w-6 md:h-6" /> SAÍDA
        </button>
        <button 
          onClick={() => setShowTransactionModal({ show: true, type: 'Inflow' })}
          className="bg-emerald-600 text-white p-4 md:p-5 rounded-[2rem] font-black text-sm md:text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2 flex-1 md:flex-none md:min-w-[140px]"
        >
          <Plus className="w-5 h-5 md:w-6 md/h-6" /> ENTRADA
        </button>
      </div>
    </div>
  );
};

export default ClientDetailView;