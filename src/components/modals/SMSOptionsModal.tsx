import React from 'react';
import { ChevronLeft, MessageSquare, FileText, Phone } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

const SMSOptionsModal: React.FC = () => {
  const {
    isDark,
    selectedClient,
    setShowSMSOptionsModal,
    handleSendSMSDebtReminder,
    handleSendStatementSMS
  } = useApp();

  if (!selectedClient) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-lg">
      <div className={`${isDark ? 'bg-slate-900 border border-white/5' : 'bg-white'} w-full max-w-[340px] rounded-[3.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black">Enviar SMS</h3>
          <button 
            onClick={() => setShowSMSOptionsModal(false)}
            className="p-2 hover:bg-slate-800/20 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
              {selectedClient.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
            </div>
            <div className="flex-1">
              <p className="font-black text-sm truncate">{selectedClient.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{selectedClient.phone}</p>
            </div>
            <button 
              onClick={() => window.open(`tel:${selectedClient.phone}`, '_blank')}
              className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-xl"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={() => {
              handleSendSMSDebtReminder();
              setShowSMSOptionsModal(false);
            }}
            className="w-full p-5 bg-blue-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 active:scale-95 transition-transform hover:brightness-110"
          >
            <MessageSquare className="w-5 h-5" />
            Enviar Cobrança
          </button>
          
          <button 
            onClick={() => {
              handleSendStatementSMS();
              setShowSMSOptionsModal(false);
            }}
            className="w-full p-5 bg-emerald-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 active:scale-95 transition-transform hover:brightness-110"
          >
            <FileText className="w-5 h-5" />
            Enviar Extrato
          </button>
          
          <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-800">
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Será aberto o aplicativo de mensagens padrão do seu celular.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSOptionsModal;