	//	SettingsView.tsx

import React from 'react';
import { 
  Moon,
  Sun,
  Globe,
  UserIcon,
  Download,
  Upload,
  CreditCard,
  Palette,
  CheckCircle,
  Plus,
    
  Circle,
  Edit2,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import GlassCard from '../shared/GlassCard';
import { PRESET_COLORS } from '../../utils/helpers';

const SettingsView: React.FC = () => {
  const {
    isDark,
    t,
    settings,
    setSettings,
    user,
    setUser,
    
  handleExportLocalData,
  handleImportLocalDataClick,
  clients,
  manualFloatAdjustments,
  invoiceCounter,
    
    isUserBoxOpen,
    setIsUserBoxOpen,
    isAccountsBoxOpen,
    setIsAccountsBoxOpen,
    newAccName,
    setNewAccName,
    editingAccountColor,
    setEditingAccountColor,
    editingAccountName,
    setEditingAccountName,
    toggleAccountStatus,
    handleEditAccountName
  } = useApp();

  return (
    <div className="p-6 pb-24 space-y-10 animate-in fade-in duration-500">
      <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {t.settings_title}
      </h2>

  {/* Firebase sync removed */}
      {/* Firebase sync removed for offline-only distribution */}

      {/* Backup/Restauração Local */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">
          Backup & Restauração Local
        </h3>
        <div className={`p-5 md:p-6 rounded-[2.5rem] shadow-sm border space-y-4 ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-100'}`}>
            <div className="space-y-3">
            <button 
              onClick={() => handleExportLocalData(user, clients, settings, manualFloatAdjustments, invoiceCounter)}
              className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <Download className="w-5 h-5" />
              Exportar Backup Completo
            </button>
            
            <button 
              onClick={handleImportLocalDataClick}
              className="w-full p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <Upload className="w-5 h-5" />
              Importar Backup
            </button>
          </div>
          
          <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
            Exporte seus dados para um arquivo JSON na pasta <strong>"Gestao Super Agente"</strong>.<br/>
            • Backup manual • Trocar de celular • Compartilhar entre dispositivos
          </p>
        </div>
      </section>

      {/* Perfil do Usuário */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">
          {t.settings_user_profile}
        </h3>
        <button 
          onClick={() => setIsUserBoxOpen(!isUserBoxOpen)}
          className={`w-full flex items-center justify-between p-5 md:p-6 rounded-[2.5rem] shadow-sm border transition-all ${isDark ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="text-left overflow-hidden max-w-[180px] md:max-w-xs">
              <p className="font-black text-base md:text-lg truncate">
                {user.name || 'Agente'}
              </p>
            </div>
          </div>
          {isUserBoxOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-300" />
          )}
        </button>
        
        {isUserBoxOpen && (
          <GlassCard isDark={isDark} className="p-5 md:p-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
            <div>
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                {t.login_name}
              </label>
              <input 
                type="text" 
                className={`w-full p-4 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-blue-600 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}
                value={user.name}
                onChange={(e) => setUser({...user, name: e.target.value})}
              />
            </div>
          </GlassCard>
        )}
      </section>

      {/* Gestão de Contas */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">
          {t.settings_accounts}
        </h3>
        <button 
          onClick={() => setIsAccountsBoxOpen(!isAccountsBoxOpen)}
          className={`w-full flex items-center justify-between p-5 md:p-6 rounded-[2.5rem] shadow-sm border transition-all ${isDark ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="text-left">
              <p className="font-black text-base md:text-lg">Contas Disponíveis</p>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 tracking-tight">
                {settings.enabledAccounts.length} ativas • {(settings.inactiveAccounts?.length || 0)} inativas
              </p>
            </div>
          </div>
          {isAccountsBoxOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-300" />
          )}
        </button>
        
        {isAccountsBoxOpen && (
          <GlassCard isDark={isDark} className="p-5 md:p-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
            <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar">
              {/* Contas Ativas */}
              <div>
                <h4 className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 mb-3">
                  Contas Ativas
                </h4>
                {settings.enabledAccounts.map((acc, idx) => {
                  const accColor = settings.accountColors[acc] || settings.uiConfig.primaryColor;
                  const isEditingColor = editingAccountColor === acc;
                  const isEditingName = editingAccountName === acc;
                  
                  return (
                    <div key={`active-${acc}-${idx}`} className="space-y-3 mb-4">
                      <div className={`flex items-center justify-between p-3 rounded-2xl ${isDark ? 'bg-slate-800/60' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setEditingAccountColor(isEditingColor ? null : acc)} 
                            className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm flex items-center justify-center transition-transform active:scale-90" 
                            style={{ backgroundColor: accColor }}
                          >
                            <Palette className="w-4 h-4 text-white opacity-80" />
                          </button>
                          
                          {isEditingName ? (
                            <input
                              type="text"
                              defaultValue={acc}
                              className={`font-bold text-xs md:text-sm border-none focus:ring-2 focus:ring-blue-600 ${isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-900'}`}
                              onBlur={(e) => handleEditAccountName(acc, e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleEditAccountName(acc, e.currentTarget.value);
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs md:text-sm uppercase truncate max-w-[100px] md:max-w-xs">
                                {acc}
                              </span>
                              <button 
                                onClick={() => setEditingAccountName(acc)}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleAccountStatus(acc)}
                            className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-colors"
                            title="Desativar conta"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              if (settings.enabledAccounts.length <= 1) { 
                                alert("Mantenha ao menos uma conta ativa."); 
                                return; 
                              }
                              const newEnabledAccounts = settings.enabledAccounts.filter(a => a !== acc);
                              const newInactiveAccounts = [...(settings.inactiveAccounts || []), acc];
                              setSettings({
                                ...settings, 
                                enabledAccounts: newEnabledAccounts,
                                inactiveAccounts: newInactiveAccounts
                              });
                            }} 
                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                          >
                            <Circle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {isEditingColor && (
                        <div className="flex gap-2 flex-wrap p-3 bg-black/10 dark:bg-black/30 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
                          {PRESET_COLORS.map(c => (
                            <button 
                              key={c} 
                              onClick={() => {
                                setSettings({
                                  ...settings, 
                                  accountColors: {...settings.accountColors, [acc]: c}
                                });
                                setEditingAccountColor(null);
                              }} 
                              className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 transition-all hover:scale-110 ${accColor === c ? 'border-white' : 'border-transparent'}`} 
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Contas Inativas */}
              {(settings.inactiveAccounts && settings.inactiveAccounts.length > 0) && (
                <div>
                  <h4 className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 mb-3">
                    Contas Inativas
                  </h4>
                  {settings.inactiveAccounts.map((acc, idx) => {
                    const accColor = settings.accountColors[acc] || settings.uiConfig.primaryColor;
                    const isEditingName = editingAccountName === acc;
                    
                    return (
                      <div key={`inactive-${acc}-${idx}`} className="space-y-3 mb-4">
                        <div className={`flex items-center justify-between p-3 rounded-2xl opacity-60 ${isDark ? 'bg-slate-800/40' : 'bg-slate-50'}`}>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm flex items-center justify-center transition-transform active:scale-90" 
                              style={{ backgroundColor: accColor }}
                            >
                              <Palette className="w-4 h-4 text-white opacity-80" />
                            </div>
                            
                            {isEditingName ? (
                              <input
                                type="text"
                                defaultValue={acc}
                                className={`font-bold text-xs md:text-sm border-none focus:ring-2 focus:ring-blue-600 ${isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-900'}`}
                                onBlur={(e) => handleEditAccountName(acc, e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleEditAccountName(acc, e.currentTarget.value);
                                  }
                                }}
                                autoFocus
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs md:text-sm uppercase truncate max-w-[100px] md:max-w-xs">
                                  {acc}
                                </span>
                                <button 
                                  onClick={() => setEditingAccountName(acc)}
                                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => toggleAccountStatus(acc)}
                              className="p-2 text-slate-500 hover:bg-slate-500/10 rounded-xl transition-colors"
                              title="Ativar conta"
                            >
                              <Circle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                const newInactiveAccounts = settings.inactiveAccounts?.filter(a => a !== acc) || [];
                                setSettings({
                                  ...settings, 
                                  inactiveAccounts: newInactiveAccounts
                                });
                              }} 
                              className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                            >
                              <Circle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <input 
                type="text" 
                placeholder="Ex: Paypal" 
                className={`flex-1 p-3 md:p-4 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-blue-600 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}
                value={newAccName}
                onChange={(e) => setNewAccName(e.target.value)}
              />
              <button 
                onClick={() => {
                  if (!newAccName.trim()) return;
                  const trimmed = newAccName.trim();
                  if (settings.enabledAccounts.includes(trimmed) || settings.inactiveAccounts?.includes(trimmed)) { 
                    alert("Conta já existe."); 
                    return; 
                  }
                  setSettings({
                    ...settings, 
                    enabledAccounts: [...settings.enabledAccounts, trimmed],
                    accountColors: { 
                      ...settings.accountColors, 
                      [trimmed]: settings.uiConfig.primaryColor 
                    }
                  });
                  setNewAccName('');
                }} 
                className="p-3 md:p-4 text-white rounded-2xl shadow-lg active:scale-95 transition-all hover:brightness-110"
                style={{ backgroundColor: settings.uiConfig.primaryColor }}
              >
                <Plus className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </GlassCard>
        )}
      </section>

      {/* Personalização da Interface */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">
          {t.ui_customization}
        </h3>
        <div className={`p-5 md:p-6 rounded-[2.5rem] shadow-sm border space-y-6 ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-100'}`}>
          <div>
            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">
              {t.ui_primary_color}
            </label>
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              {PRESET_COLORS.map(c => (
                <button 
                  key={c} 
                  onClick={() => setSettings({
                    ...settings, 
                    uiConfig: {...settings.uiConfig, primaryColor: c}
                  })}
                  className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all hover:scale-110 ${settings.uiConfig.primaryColor === c ? 'border-white' : 'border-transparent shadow-md'}`}
                  style={{ backgroundColor: c }}
                >
                  {settings.uiConfig.primaryColor === c && (
                    <Check className="w-5 h-5 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t.ui_transparency}
              </label>
              <span className="text-[10px] font-black text-blue-500">
                {Math.round(settings.uiConfig.transparency * 100)}%
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              value={settings.uiConfig.transparency}
              onChange={(e) => setSettings({
                ...settings, 
                uiConfig: {...settings.uiConfig, transparency: parseFloat(e.target.value)}
              })} 
            />
          </div>
        </div>
      </section>

      {/* Modelos de SMS */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">
          {t.settings_sms}
        </h3>
        <div className={`p-5 md:p-6 rounded-[2.5rem] shadow-sm border space-y-6 ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-100'}`}>
          <div>
            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
              Confirmação
            </label>
            <textarea 
              className={`w-full p-4 rounded-2xl text-[11px] md:text-xs font-bold border-none focus:ring-2 focus:ring-blue-600 transition-all ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
              rows={3}
              value={settings.smsTemplates.confirmation}
              onChange={(e) => setSettings({
                ...settings, 
                smsTemplates: {...settings.smsTemplates, confirmation: e.target.value}
              })}
            />
          </div>
          
          <div>
            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
              Cobrança
            </label>
            <textarea 
              className={`w-full p-4 rounded-2xl text-[11px] md:text-xs font-bold border-none focus:ring-2 focus:ring-blue-600 transition-all ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
              rows={3}
              value={settings.smsTemplates.debtReminder}
              onChange={(e) => setSettings({
                ...settings, 
                smsTemplates: {...settings.smsTemplates, debtReminder: e.target.value}
              })}
            />
          </div>
        </div>
      </section>

      {/* Aparência */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">
          {t.settings_appearance}
        </h3>
        <div className={`p-5 md:p-6 rounded-[2.5rem] shadow-sm border space-y-6 ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isDark ? (
                <Moon className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
              ) : (
                <Sun className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
              )}
              <span className="font-extrabold text-xs md:text-sm">
                {t.settings_darkmode}
              </span>
            </div>
            <button 
              onClick={() => setSettings({
                ...settings, 
                theme: isDark ? 'light' : 'dark'
              })}
              className={`w-12 h-7 md:w-14 md:h-8 rounded-full transition-all relative ${isDark ? 'bg-blue-600' : 'bg-slate-200'}`}
              style={{ backgroundColor: isDark ? settings.uiConfig.primaryColor : undefined }}
            >
              <div className={`absolute top-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full transition-all shadow-md ${isDark ? 'left-6 md:left-7' : 'left-1'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Globe className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
              <span className="font-extrabold text-xs md:text-sm">
                {t.settings_language}
              </span>
            </div>
            <button 
              onClick={() => setSettings({
                ...settings, 
                language: settings.language === 'pt' ? 'en' : 'pt'
              })}
              className={`px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
            >
              {settings.language === 'pt' ? 'Português' : 'English'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;