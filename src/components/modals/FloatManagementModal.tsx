import React, { useState } from 'react';
import { Plus, Minus, Wallet } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

const FloatManagementModal: React.FC = () => {
  const {
    isDark,
    t,
    settings,
    setShowFloatModal,
    manualFloatAdjustments,
    setManualFloatAdjustments,
    handleCreateAutomaticBackup
  } = useApp();

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(settings.enabledAccounts[0] || 'Cash');
  const [type, setType] = useState<'Add' | 'Sub'>('Add');

  const handleConfirm = () => {
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      const adjustment = type === 'Add' ? val : -val;
      const newAdjustments = {
        ...manualFloatAdjustments,
        [method]: (manualFloatAdjustments[method] || 0) + adjustment
      };
      
      setManualFloatAdjustments(newAdjustments);
      handleCreateAutomaticBackup();
    }
    setShowFloatModal(false);
    setAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className={`${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'} w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-200`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>
            Gestão de Float
          </h3>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex gap-2">
            <button 
              onClick={() => setType('Add')}
              className={`flex-1 p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 ${type === 'Add' ? 'bg-emerald-600 text-white' : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100')}`}
            >
              <Plus className="w-4 h-4" /> Adicionar
            </button>
            <button 
              onClick={() => setType('Sub')}
              className={`flex-1 p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 ${type === 'Sub' ? 'bg-rose-600 text-white' : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100')}`}
            >
              <Minus className="w-4 h-4" /> Retirar
            </button>
          </div>
          
          <input 
            type="number" 
            placeholder="Valor"
            className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 ${isDark ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-900'}`}
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          
          <select 
            className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 ${isDark ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-900'}`}
            value={method}
            onChange={e => setMethod(e.target.value)}
          >
            {settings.enabledAccounts.map(acc => (
              <option key={acc} value={acc}>{acc}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setShowFloatModal(false)}
            className={`flex-1 p-4 rounded-2xl font-bold ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'}`}
          >
            {t.tx_cancel}
          </button>
          <button 
            onClick={handleConfirm}
            className="flex-1 p-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-transform"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatManagementModal;