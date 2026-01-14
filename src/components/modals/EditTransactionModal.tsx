import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Send, Plus, Minus } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

const EditTransactionModal: React.FC = () => {
  const {
    isDark,
    editingTransaction,
    selectedClient,
    settings,
    setShowEditTransactionModal,
    setEditingTransaction,
    handleEditTransaction,
    handleSendTransactionConfirmation
  } = useApp();

  const [formData, setFormData] = useState({
    amount: editingTransaction?.amount.toString() || '',
    method: editingTransaction?.method || settings.enabledAccounts[0],
    date: editingTransaction?.date.split('T')[0] || new Date().toISOString().split('T')[0],
    desc: editingTransaction?.description || '',
    type: editingTransaction?.type || 'Outflow'
  });

  if (!editingTransaction || !selectedClient) return null;

  const handleSave = () => {
    const updatedTx = {
      ...editingTransaction,
      amount: parseFloat(formData.amount),
      method: formData.method,
      date: `${formData.date}T${new Date(editingTransaction.date).toTimeString().split(' ')[0]}`,
      description: formData.desc,
      type: formData.type as 'Inflow' | 'Outflow'
    };
    
    handleEditTransaction(updatedTx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className={`${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'} w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-300`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>
            Editar Transação
          </h3>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.type === 'Inflow' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {formData.type === 'Inflow' ? (
              <ArrowDownLeft className="w-5 h-5" />
            ) : (
              <ArrowUpRight className="w-5 h-5" />
            )}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">
              Tipo
            </label>
            <div className="flex gap-2">
              <button 
                onClick={() => setFormData({...formData, type: 'Inflow'})}
                className={`flex-1 p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 ${formData.type === 'Inflow' ? 'bg-emerald-600 text-white' : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100')}`}
              >
                <Plus className="w-4 h-4" /> Entrada
              </button>
              <button 
                onClick={() => setFormData({...formData, type: 'Outflow'})}
                className={`flex-1 p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 ${formData.type === 'Outflow' ? 'bg-rose-600 text-white' : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100')}`}
              >
                <Minus className="w-4 h-4" /> Saída
              </button>
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">
              Valor ({settings.currency})
            </label>
            <input 
              type="number" 
              placeholder="0.00"
              className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 text-lg font-bold ${isDark ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-900'}`}
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
          
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">
              Método
            </label>
            <div className="grid grid-cols-2 gap-2">
              {settings.enabledAccounts.map(m => {
                const isSelected = formData.method === m;
                const accColor = settings.accountColors[m] || settings.uiConfig.primaryColor;
                return (
                  <button 
                    key={m} 
                    onClick={() => setFormData({ ...formData, method: m })} 
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
              Data
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
              Descrição
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
        
        <div className="space-y-3">
          <div className="flex gap-3">
            <button 
              onClick={() => handleSendTransactionConfirmation(editingTransaction)}
              className="flex-1 p-3 bg-blue-600 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Enviar Confirmação
            </button>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => {
                setShowEditTransactionModal(false);
                setEditingTransaction(null);
              }}
              className={`flex-1 p-4 rounded-2xl font-bold ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'}`}
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 p-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTransactionModal;