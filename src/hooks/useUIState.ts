// src/hooks/useUIState.ts
import { useState, useMemo, useRef, useEffect } from 'react';
import localforage from 'localforage';
import { ViewState, AppSettings } from '../types';
import { translations } from '../constants';

export const useUIState = (initialSettings: AppSettings) => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [isUserBoxOpen, setIsUserBoxOpen] = useState(false);
  const [isAccountsBoxOpen, setIsAccountsBoxOpen] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [editingAccountColor, setEditingAccountColor] = useState<string | null>(null);
  const [editingAccountName, setEditingAccountName] = useState<string | null>(null);
  const [showFloatModal, setShowFloatModal] = useState(false);

  // Referências
  const mainRef = useRef<HTMLDivElement>(null);
  const clientHeaderRef = useRef<HTMLDivElement>(null);
  const clientTransactionsRef = useRef<HTMLDivElement>(null);

  // Dados computados
  const isDark = useMemo(() => settings.theme === 'dark', [settings.theme]);
  const t = useMemo(() => translations[settings.language], [settings.language]);

  // Aplicar tema dark/light
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Persistir view atual para manter após reload
  useEffect(() => {
    try {
      localforage.setItem('agent_view', view);
    } catch (error) {
      // Silenciar
    }
  }, [view]);

  // Alternar status da conta (ativa/inativa)
  const toggleAccountStatus = (accountName: string) => {
    const isCurrentlyActive = settings.enabledAccounts.includes(accountName);
    const isCurrentlyInactive = settings.inactiveAccounts?.includes(accountName) || false;
    
    let newEnabledAccounts = [...settings.enabledAccounts];
    let newInactiveAccounts = [...(settings.inactiveAccounts || [])];
    
    if (isCurrentlyActive) {
      // Mover para inativas
      newEnabledAccounts = newEnabledAccounts.filter(acc => acc !== accountName);
      newInactiveAccounts.push(accountName);
    } else if (isCurrentlyInactive) {
      // Mover para ativas
      newInactiveAccounts = newInactiveAccounts.filter(acc => acc !== accountName);
      newEnabledAccounts.push(accountName);
    } else {
      // Conta nova? Adicionar às ativas
      newEnabledAccounts.push(accountName);
    }
    
    setSettings({
      ...settings,
      enabledAccounts: newEnabledAccounts,
      inactiveAccounts: newInactiveAccounts
    });
  };

  // Editar nome da conta
  const handleEditAccountName = (oldName: string, newName: string) => {
    if (!newName.trim()) return;
    
    const trimmedName = newName.trim();
    
    // Verificar se o novo nome já existe
    if (settings.enabledAccounts.includes(trimmedName) || settings.inactiveAccounts?.includes(trimmedName)) {
      alert("Já existe uma conta com este nome.");
      return;
    }
    
    // Atualizar enabledAccounts
    const newEnabledAccounts = settings.enabledAccounts.map(acc => 
      acc === oldName ? trimmedName : acc
    );
    
    // Atualizar inactiveAccounts
    const newInactiveAccounts = (settings.inactiveAccounts || []).map(acc => 
      acc === oldName ? trimmedName : acc
    );
    
    // Atualizar accountColors
    const oldColor = settings.accountColors[oldName];
    const newAccountColors = { ...settings.accountColors };
    
    if (oldColor) {
      delete newAccountColors[oldName];
      newAccountColors[trimmedName] = oldColor;
    }
    
    setSettings({
      ...settings,
      enabledAccounts: newEnabledAccounts,
      inactiveAccounts: newInactiveAccounts,
      accountColors: newAccountColors
    });
    
    setEditingAccountName(null);
  };

  // Adicionar nova conta
  const addNewAccount = () => {
    if (!newAccName.trim()) {
      alert('Por favor, digite um nome para a conta');
      return;
    }
    
    const trimmedName = newAccName.trim();
    
    // Verificar se já existe
    if (
      settings.enabledAccounts.includes(trimmedName) || 
      settings.inactiveAccounts?.includes(trimmedName)
    ) {
      alert('Já existe uma conta com este nome');
      return;
    }
    
    // Adicionar às contas ativas
    const newEnabledAccounts = [...settings.enabledAccounts, trimmedName];
    
    // Adicionar cor padrão
    const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const newAccountColors = { ...settings.accountColors };
    
    if (!newAccountColors[trimmedName]) {
      // Encontrar uma cor não utilizada
      const usedColors = Object.values(newAccountColors);
      const availableColor = defaultColors.find(color => !usedColors.includes(color)) || '#6b7280';
      newAccountColors[trimmedName] = availableColor;
    }
    
    setSettings({
      ...settings,
      enabledAccounts: newEnabledAccounts,
      accountColors: newAccountColors
    });
    
    setNewAccName('');
  };

  // Alterar cor da conta
  const changeAccountColor = (accountName: string, color: string) => {
    setSettings({
      ...settings,
      accountColors: {
        ...settings.accountColors,
        [accountName]: color
      }
    });
    setEditingAccountColor(null);
  };

  // Alterar idioma
  const changeLanguage = (language: 'pt' | 'en') => {
    setSettings({
      ...settings,
      language
    });
  };

  // Alterar tema
  const toggleTheme = () => {
    setSettings({
      ...settings,
      theme: settings.theme === 'light' ? 'dark' : 'light'
    });
  };

  // Alterar moeda
  const changeCurrency = (currency: string) => {
    setSettings({
      ...settings,
      currency
    });
  };

  return {
    // Estados
    view,
    setView,
    settings,
    setSettings,
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
    showFloatModal,
    setShowFloatModal,
    
    // Referências
    mainRef,
    clientHeaderRef,
    clientTransactionsRef,
    
    // Dados computados
    isDark,
    t,
    
    // Funções
    toggleAccountStatus,
    handleEditAccountName,
    addNewAccount,
    changeAccountColor,
    changeLanguage,
    toggleTheme,
    changeCurrency
  };
};