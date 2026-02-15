// src/hooks/useBackup.ts
import { useState, useCallback } from 'react';
import localforage from 'localforage';
import { 
  UserProfile, 
  Client, 
  AppSettings, 
  PaymentMethod 
} from '../types';
import { 
  createAutomaticBackup,
  exportLocalData,
  importLocalData
} from '../utils/backupUtils';

export const useBackup = () => {
  const [isLoading, setIsLoading] = useState(true);
  // Firebase sync removed for offline-only app

  // Carregar dados salvos
  const loadSavedData = useCallback(async (): Promise<{
    user: UserProfile | null;
    clients: Client[];
    settings: AppSettings | null;
    manualFloatAdjustments: Record<PaymentMethod, number>;
    invoiceCounter: number;
    view: string | null;
    selectedClientId: string | null;
  }> => {
    try {
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

      await requestPersistentStorage();
      
      // Verificar backup automático
      const backupSalvo = localStorage.getItem('super_agente_backup');
      
      if (backupSalvo) {
        try {
          const backup = JSON.parse(backupSalvo);
          
          if (backup.conteudo && backup.conteudo.user) {
            const { 
              user: backupUser, 
              clients: backupClients, 
              settings: backupSettings, 
              manualFloatAdjustments: backupFloat,
              invoiceCounter: backupInvoiceCounter 
            } = backup.conteudo;
            
            return {
              user: backupUser || null,
              clients: backupClients || [],
              settings: backupSettings || null,
              manualFloatAdjustments: backupFloat || {},
              invoiceCounter: backupInvoiceCounter || 1,
              view: backup.conteudo.view || null,
              selectedClientId: backup.conteudo.selectedClientId || null
            };
          }
        } catch (erroBackup) {
          // Backup corrompido, ignorar
        }
      }
      
      // Carregar do localforage
      const [savedUser, savedClients, savedSettings, savedFloat, savedInvoiceCounter, savedView, savedSelectedClientId] = await Promise.all([
        localforage.getItem<UserProfile>('agent_user'),
        localforage.getItem<Client[]>('agent_clients'),
        localforage.getItem<AppSettings>('agent_settings'),
        localforage.getItem<Record<PaymentMethod, number>>('agent_float'),
        localforage.getItem<number>('agent_invoice_counter')
        ,localforage.getItem<string>('agent_view')
        ,localforage.getItem<string>('agent_selected_client_id')
      ]);

      return {
        user: savedUser || null,
        clients: savedClients || [],
        settings: savedSettings || null,
        manualFloatAdjustments: savedFloat || {},
        invoiceCounter: savedInvoiceCounter || 1,
        view: savedView || null,
        selectedClientId: savedSelectedClientId || null
      };
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      return {
        user: null,
        clients: [],
        settings: null,
        manualFloatAdjustments: {},
        invoiceCounter: 1,
        view: null,
        selectedClientId: null
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar todos os dados
  const saveAllData = useCallback(async (
    user: UserProfile,
    clients: Client[],
    settings: AppSettings,
    manualFloatAdjustments: Record<PaymentMethod, number>,
    invoiceCounter: number
  ) => {
    try {
      await Promise.all([
        localforage.setItem('agent_user', user),
        localforage.setItem('agent_clients', clients),
        localforage.setItem('agent_settings', settings),
        localforage.setItem('agent_float', manualFloatAdjustments),
        localforage.setItem('agent_invoice_counter', invoiceCounter)
      ]);
      
      await createAutomaticBackup(user, clients, settings, manualFloatAdjustments, invoiceCounter);
      
      // Offline-only: no cloud sync
    } catch (error) {
      console.error('❌ Erro ao salvar dados:', error);
      throw error;
    }
  }, []);

  // Exportar dados locais
  const handleExportLocalData = useCallback((
    user: UserProfile,
    clients: Client[],
    settings: AppSettings,
    manualFloatAdjustments: Record<PaymentMethod, number>,
    invoiceCounter: number
  ) => {
    try {
      const success = exportLocalData(user, clients, settings, manualFloatAdjustments, invoiceCounter);
      if (success) {
        alert('✅ Backup exportado com sucesso!\nO arquivo foi salvo na pasta de Downloads.');
      }
    } catch (error) {
      console.error('❌ Erro ao exportar backup:', error);
      alert('❌ Erro ao exportar backup. Verifique o console para mais detalhes.');
    }
  }, []);

  // Importar dados locais
  const handleImportLocalDataClick = async (): Promise<{
    user: UserProfile;
    clients: Client[];
    settings: AppSettings;
    manualFloatAdjustments: Record<PaymentMethod, number>;
    invoiceCounter: number;
  } | null> => {
    try {
      const result = await importLocalData();
      if (result) {
        alert('✅ Backup importado com sucesso!\nA aplicação será recarregada com os dados restaurados.');
      }
      return result;
    } catch (error) {
      console.error('❌ Erro ao importar backup:', error);
      alert('❌ Erro ao importar backup. Verifique o arquivo e tente novamente.');
      return null;
    }
  };


  return {
    // Estados
  isLoading,
  setIsLoading,
    
    // Funções
    loadSavedData,
    saveAllData,
    handleExportLocalData,
    handleImportLocalDataClick,
    // cloud sync removed
  };
};