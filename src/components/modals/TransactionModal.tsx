import React, { useState } from 'react';
import { AlertCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

const TransactionModal: React.FC = () => {
  const {
    isDark,
    t,
    settings,
    showTransactionModal,
    selectedClient,
    clients,
    setClients,
    setShowTransactionModal,
    setShowSMSConfirmModal,
    agentBalances,
    handleCreateAutomaticBackup
  } = useApp();

  const [formData, setFormData] = useState({
    amount: '',
    method: settings.enabledAccounts[0] || 'Cash',
    date: new Date().toISOString().split('T')[0],
    desc: ''
  });

  const [error, setError] = useState<string | null>(null);

  const currentAccountBalance = agentBalances[formData.method] || 0;

  const handleSubmit = () => {
    if (!selectedClient || !showTransactionModal.type) return;
    
    const amt = parseFloat(formData.amount);
    
    if (isNaN(amt) || amt <= 0) {
      setError("Valor inválido");
      return;
    }

    if (showTransactionModal.type === 'Outflow' && amt > currentAccountBalance) {
      setError("Saldo insuficiente na conta selecionada!");
      return;
    }

    // Adicionar hora atual à data
    const now = new Date();
    const dateWithTime = `${formData.date}T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const newTx = {
      id: Math.random().toString(36).substring(2, 9),
      type: showTransactionModal.type,
      amount: amt,
      method: formData.method,
      date: dateWithTime,
      dueDate: formData.date,
      description: formData.desc,
      settled: showTransactionModal.type === 'Inflow'
    };

    // Atualizar clients
    const updatedClients = clients.map(c => 
      c.id === selectedClient.id 
        ? { ...c, activeAccount: [newTx, ...c.activeAccount] } 
        : c
    );
    
    setClients(updatedClients);
    setShowTransactionModal({ show: false, type: null });
    
    // Criar backup automático
    handleCreateAutomaticBackup();
    
    if (newTx.type === 'Outflow') {
      setShowSMSConfirmModal({ show: true, tx: newTx });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className={`${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'} w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-300`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>
            {showTransactionModal.type === 'Inflow' ? t.tx_inflow : t.tx_outflow}
          </h3>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${showTransactionModal.type === 'Inflow' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {showTransactionModal.type === 'Inflow' ? (
              <ArrowDownLeft className="w-5 h-5" />
            ) : (
              <ArrowUpRight className="w-5 h-5" />
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-500 text-xs font-bold animate-in fade-in zoom-in-95">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">
              {t.tx_amount} ({settings.currency})
            </label>
            <input 
              type="number" 
              placeholder="0.00"
              className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 text-lg font-bold ${isDark ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-900'}`}
              value={formData.amount}
              onChange={e => { 
                setFormData({ ...formData, amount: e.target.value }); 
                setError(null); 
              }}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center ml-2 mb-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                {t.tx_method}
              </label>
              <span className={`text-[9px] font-black uppercase ${currentAccountBalance > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                Saldo: {currentAccountBalance.toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {settings.enabledAccounts.map(m => {
                const isSelected = formData.method === m;
                const accColor = settings.accountColors[m] || settings.uiConfig.primaryColor;
                return (
                  <button 
                    key={m} 
                    onClick={() => { 
                      setFormData({ ...formData, method: m }); 
                      setError(null); 
                    }} 
                    className={`p-2 rounded-xl text-[10px] font-bold transition-all border ${isSelected ? 'text-white shadow-md' : (isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-gray-50 text-gray-500 border-gray-100')}`}
                    style={{ 
                      backgroundColor: isSelected ? accColor : undefined, 
                      borderColor: isSelected ? accColor : undefined 
                    }}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">
              {t.tx_date}
            </label>
            <input 
              type="date"
              className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 text-sm ${isDark ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-900'}`}
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">
              {t.tx_desc}
            </label>
            <input 
              type="text" 
              placeholder="Ex: Pagamento"
              className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 text-sm ${isDark ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-900'}`}
              value={formData.desc}
              onChange={e => setFormData({ ...formData, desc: e.target.value })}
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setShowTransactionModal({ show: false, type: null })}
            className={`flex-1 p-4 rounded-2xl font-bold ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'}`}
          >
            {t.tx_cancel}
          </button>
          <button 
            onClick={handleSubmit}
            className={`flex-1 p-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-transform ${showTransactionModal.type === 'Inflow' ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-rose-600 shadow-rose-600/20'}`}
          >
            {t.tx_confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;