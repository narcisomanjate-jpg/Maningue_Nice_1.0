import React from 'react';
import { Send, X } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

const SMSConfirmModal: React.FC = () => {
  const {
    isDark,
    t,
    settings,
    selectedClient,
    showSMSConfirmModal,
    setShowSMSConfirmModal
  } = useApp();

  const handleSendSMS = () => {
    if (!selectedClient || !showSMSConfirmModal.tx) return;
    
    const text = settings.smsTemplates.confirmation
      .replace('{amount}', showSMSConfirmModal.tx.amount.toString())
      .replace('{currency}', settings.currency)
      .replace('{desc}', showSMSConfirmModal.tx.description || showSMSConfirmModal.tx.type);
    
    const separator = /iPhone|iPad|iPod/.test(navigator.userAgent) ? '&' : '?';
    const url = `sms:${selectedClient.phone}${separator}body=${encodeURIComponent(text)}`;
    try {
      const opened = window.open(url, '_blank');
      if (!opened) window.location.href = url;
    } catch (e) {
      window.location.href = url;
    }
    setShowSMSConfirmModal({ show: false, tx: null });
  };

  if (!showSMSConfirmModal.tx) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-lg">
      <div className={`${isDark ? 'bg-slate-900 border border-white/5' : 'bg-white'} w-full max-w-[340px] rounded-[3.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200`}>
        <div className="w-16 h-16 bg-blue-100/50 dark:bg-blue-500/20 rounded-3xl flex items-center justify-center text-blue-600 mb-6 mx-auto">
          <Send className="w-8 h-8" />
        </div>
        
        <h3 className="text-xl font-black text-center mb-2">
          {t.sms_confirm_prompt}
        </h3>
        
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold text-center leading-relaxed">
            {settings.smsTemplates.confirmation
              .replace('{amount}', showSMSConfirmModal.tx.amount.toLocaleString() || '0')
              .replace('{currency}', settings.currency)
              .replace('{desc}', showSMSConfirmModal.tx.description || '')}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowSMSConfirmModal({ show: false, tx: null })}
            className={`flex-1 p-4 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all hover:brightness-95 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'} flex items-center justify-center gap-2`}
          >
            <X className="w-3 h-3" /> {t.tx_cancel}
          </button>
          <button 
            onClick={handleSendSMS}
            className="flex-1 p-4 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-xl active:scale-95 transition-all hover:brightness-110 flex items-center justify-center gap-2"
            style={{ backgroundColor: settings.uiConfig.primaryColor }}
          >
            <Send className="w-3 h-3" /> {t.sms_confirm_btn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SMSConfirmModal;