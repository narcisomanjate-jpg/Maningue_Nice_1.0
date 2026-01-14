

import React, { useState } from 'react';
import { AlertCircle, UserPlus, Users } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { importContactsFromDevice } from '../../utils/contactUtils';

const AddClientModal: React.FC = () => {
  const {
    isDark,
    t,
    clients,
    setShowAddClient,
    searchQuery,
    setClients,
    handleCreateAutomaticBackup
  } = useApp();

  const { settings } = useApp();

  const [name, setName] = useState(searchQuery || '');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [importingContacts, setImportingContacts] = useState(false);

  const handleImportContacts = async () => {
    setImportingContacts(true);
    try {
      const contacts = await importContactsFromDevice();
      if (contacts.length > 0) {
        const firstContact = contacts[0];
        setName(firstContact.name);
        setPhone(firstContact.phone);
      }
    } catch (error) {
      console.error('Erro ao importar contatos:', error);
    } finally {
      setImportingContacts(false);
    }
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    
    if (!trimmedName || !trimmedPhone) {
      setError("Preencha todos os campos.");
      return;
    }

    const isDuplicate = clients.some(c => 
      c.name.toLowerCase() === trimmedName.toLowerCase() || c.phone === trimmedPhone
    );

    if (isDuplicate) {
      setError("Já existe um cliente com este nome ou número.");
      return;
    }

    // Criar novo cliente
    const newClient = {
      id: Math.random().toString(36).substring(2, 9),
      name: trimmedName,
      phone: trimmedPhone,
      activeAccount: [],
      archive: []
    };

    setClients([...clients, newClient]);
    setShowAddClient(false);
    setName('');
    setPhone('');
    
    // Criar backup automático
    handleCreateAutomaticBackup();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className={`${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'} w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-200`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>
            Novo Cliente
          </h3>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-500 text-[10px] font-bold">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder={t.login_name}
              className={`flex-1 p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 ${isDark ? 'bg-slate-800 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'}`}
              value={name}
              onChange={(e) => { setName(e.target.value); setError(null); }}
            />
            <button 
              onClick={handleImportContacts}
              disabled={importingContacts}
              className="p-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-1 transition-colors disabled:opacity-50 hover:brightness-110 active:scale-95"
              title="Importar contatos"
              style={{ backgroundColor: settings?.uiConfig?.primaryColor, color: '#fff' }}
            >
              {importingContacts ? (
                <span className="text-sm">...</span>
              ) : (
                <Users className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
          
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
            onClick={() => setShowAddClient(false)}
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

export default AddClientModal;