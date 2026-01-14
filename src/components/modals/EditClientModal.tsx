import React, { useState } from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

const EditClientModal: React.FC = () => {
  const {
    isDark,
    t,
    selectedClient,
    clients,
    setShowEditClient,
    setClients,
    setView,
    handleCreateAutomaticBackup
  } = useApp();

  const [name, setName] = useState(selectedClient?.name || '');
  const [phone, setPhone] = useState(selectedClient?.phone || '');
  const [error, setError] = useState<string | null>(null);

  if (!selectedClient) return null;

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    
    if (!trimmedName || !trimmedPhone) {
      setError("Preencha todos os campos.");
      return;
    }

    const isDuplicate = clients.some(c => 
      c.id !== selectedClient.id && 
      (c.name.toLowerCase() === trimmedName.toLowerCase() || c.phone === trimmedPhone)
    );

    if (isDuplicate) {
      setError("Já existe um cliente com este nome ou número.");
      return;
    }

    // Atualizar cliente
    const updatedClients = clients.map(c => 
      c.id === selectedClient.id 
        ? { ...c, name: trimmedName, phone: trimmedPhone } 
        : c
    );
    
    setClients(updatedClients);
    setShowEditClient(false);
    
    // Criar backup automático
    handleCreateAutomaticBackup();
  };

  const handleDelete = () => {
    if (window.confirm(t.confirm_delete)) {
      const updatedClients = clients.filter(c => c.id !== selectedClient.id);
      setClients(updatedClients);
      setShowEditClient(false);
      setView('clients');
      handleCreateAutomaticBackup();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className={`${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'} w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-200`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>
            {t.client_edit}
          </h3>
          <button 
            onClick={handleDelete}
            className="text-rose-500 p-2 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-500 text-[10px] font-bold">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="space-y-4 mb-8">
          <input 
            type="text" 
            placeholder={t.login_name}
            className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 ${isDark ? 'bg-slate-800 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'}`}
            value={name}
            onChange={(e) => { setName(e.target.value); setError(null); }}
          />
          
          <input 
            type="tel" 
            placeholder={t.login_phone}
            className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 ${isDark ? 'bg-slate-800 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'}`}
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setError(null); }}
          />
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setShowEditClient(false)}
            className={`flex-1 p-4 rounded-2xl font-bold ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'}`}
          >
            {t.tx_cancel}
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 p-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-transform"
          >
            {t.modal_save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditClientModal;