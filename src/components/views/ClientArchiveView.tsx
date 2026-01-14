	//	ClientArchiveView.tsx

import React from 'react';
import { ChevronLeft, Archive, FileText, Printer, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { formatTime } from '../../utils/helpers';

const ClientArchiveView: React.FC = () => {
  const {
    isDark,
    t,
    selectedClient,
    handleViewInvoice,
    setView
  } = useApp();

  if (!selectedClient) {
    return null;
  }

  return (
    <div className="min-h-full flex flex-col animate-in slide-in-from-right-10 duration-500 no-scrollbar">
      <div className="p-8 pt-12 pb-6 flex items-center gap-4">
        <button 
          onClick={() => setView('client-detail')}
          className={`p-3 rounded-2xl transition-all ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-white border border-slate-100 text-slate-600 shadow-sm'}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t.client_archive_title}
        </h2>
      </div>
      
      <div className="flex-1 p-6 space-y-8">
        {selectedClient.archive.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center opacity-40">
            <Archive className="w-16 h-16 mb-4" />
            <p className="font-bold text-sm">{t.archive_empty}</p>
          </div>
        ) : (
          selectedClient.archive.map((archive, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {t.archive_date}: {new Date(archive.dateClosed).toLocaleDateString()}
                    </p>
                    {archive.invoiceNumber && (
                      <p className={`text-[9px] font-bold mt-1 flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        <FileText className="w-3 h-3" />
                        Fatura: <span className="text-blue-500 font-black">{archive.invoiceNumber}</span>
                      </p>
                    )}
                  </div>
                </div>
                {archive.invoiceNumber && (
                  <button 
                    onClick={() => handleViewInvoice(selectedClient, archive)}
                    className="text-[8px] px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold flex items-center gap-1 transition-colors active:scale-95"
                  >
                    <Printer className="w-3 h-3" /> Visualizar
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                {archive.transactions.map(tx => (
                  <div 
                    key={tx.id} 
                    className={`p-4 rounded-3xl border shadow-sm flex items-center justify-between opacity-80 ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'Inflow' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {tx.type === 'Inflow' ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className={`font-black text-xs uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {tx.description || tx.type}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-[9px] text-slate-400 font-bold uppercase">
                            {tx.method}
                          </p>
                          <span className="text-slate-300">•</span>
                          <p className="text-[9px] text-slate-400 font-bold">
                            {new Date(tx.date).toLocaleDateString()} • {formatTime(tx.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className={`font-black text-sm ${tx.type === 'Inflow' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {tx.type === 'Inflow' ? '+' : '-'}{tx.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientArchiveView;