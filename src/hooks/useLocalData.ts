import { useState } from 'react';
import localforage from 'localforage';

export const useLocalData = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Solicitar armazenamento persistente
  const requestPersistentStorage = async () => {
    try {
      if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persisted();
        if (!isPersisted) {
          await navigator.storage.persist();
        }
      }
    } catch (error) {
      // Silenciar erros
    }
  };

  // Salvar dados individualmente
  const saveData = async (key: string, data: any) => {
    try {
      await localforage.setItem(key, data);
      return { success: true };
    } catch (error) {
      console.error(`❌ Erro ao salvar ${key}:`, error);
      return { success: false, error };
    }
  };

  // Carregar dados individualmente
  const loadData = async <T,>(key: string): Promise<T | null> => {
    try {
      const data = await localforage.getItem<T>(key);
      return data;
    } catch (error) {
      console.error(`❌ Erro ao carregar ${key}:`, error);
      return null;
    }
  };

  // Salvar todos os dados
  const saveAllData = async (data: {
    user: any;
    clients: any[];
    settings: any;
    manualFloatAdjustments: any;
    invoiceCounter: number;
  }) => {
    try {
      await Promise.all([
        saveData('agent_user', data.user),
        saveData('agent_clients', data.clients),
        saveData('agent_settings', data.settings),
        saveData('agent_float', data.manualFloatAdjustments),
        saveData('agent_invoice_counter', data.invoiceCounter)
      ]);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Carregar todos os dados
  const loadAllData = async () => {
    try {
      const [user, clients, settings, manualFloatAdjustments, invoiceCounter] = await Promise.all([
        loadData('agent_user'),
        loadData('agent_clients'),
        loadData('agent_settings'),
        loadData('agent_float'),
        loadData('agent_invoice_counter')
      ]);

      return {
        user,
        clients,
        settings,
        manualFloatAdjustments,
        invoiceCounter
      };
    } catch (error) {
      console.error('❌ Erro ao carregar todos os dados:', error);
      return null;
    }
  };

  return {
    isExporting,
    setIsExporting,
    isImporting,
    setIsImporting,
    requestPersistentStorage,
    saveData,
    loadData,
    saveAllData,
    loadAllData
  };
};