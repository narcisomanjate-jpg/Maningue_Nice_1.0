// src/hooks/useAppState.ts
import { useState, useMemo, useEffect } from 'react';
import { UserProfile, AppSettings, PaymentMethod } from '../types';
import { INITIAL_SETTINGS } from '../constants';
import { useClients } from './useClients';
import { useTransactions } from './useTransactions';
import { useBackup } from './useBackup';
import { useUIState } from './useUIState';

export const useAppState = () => {
  // ============ ESTADOS PRINCIPAIS ============
  const [user, setUser] = useState<UserProfile>({ name: 'Agente', isFirstTime: false });
  const [manualFloatAdjustments, setManualFloatAdjustments] = useState<Record<PaymentMethod, number>>({ 
    'Super M-pesa': 0, 'Super E-mola': 0, 'M-pesa': 0, 'E-mola': 0, 'Mkesh': 0, 'Cash': 0 
  });
  const [invoiceCounter, setInvoiceCounter] = useState<number>(1);

  // Configurações iniciais
  const initialSettings: AppSettings = {
    ...INITIAL_SETTINGS,
    enabledAccounts: ['Super M-pesa', 'Super E-mola', 'M-pesa', 'E-mola', 'Mkesh', 'Cash'],
    accountColors: {
      ...INITIAL_SETTINGS.accountColors,
      'Mkesh': '#06b6d4'
    },
    inactiveAccounts: [] as string[]
  };

  // ============ HOOKS ESPECIALIZADOS ============
  const clientsHook = useClients([]);
  const transactionsHook = useTransactions();
  const backupHook = useBackup();
  const uiHook = useUIState(initialSettings);

  // ============ DADOS COMPUTADOS GLOBAIS ============
  
  // Calcular saldos dos agentes
  const agentBalances = useMemo(() => {
    const balances: Record<PaymentMethod, number> = { ...manualFloatAdjustments };
    
    clientsHook.clients.forEach(c => {
      c.activeAccount.forEach(tx => {
        if (tx.type === 'Inflow') {
          balances[tx.method] = (balances[tx.method] || 0) + tx.amount;
        } else {
          balances[tx.method] = (balances[tx.method] || 0) - tx.amount;
        }
      });
      
      c.archive.forEach(arch => {
        arch.transactions.forEach(tx => {
          if (tx.type === 'Inflow') {
            balances[tx.method] = (balances[tx.method] || 0) + tx.amount;
          } else {
            balances[tx.method] = (balances[tx.method] || 0) - tx.amount;
          }
        });
      });
    });
    
    return balances;
  }, [clientsHook.clients, manualFloatAdjustments]);

  // ============ FUNÇÕES COMPOSTAS ============
  
  const handleCloseAccount = (client: any) => {
    // Agora aceita o objeto Client diretamente (chamado pela UI)
    const clientObj = client as any as { id?: string };
    // Se foi passado o objeto Client, usar seu id
    const id = (clientObj && clientObj.id) ? clientObj.id : (client as unknown as string);

  const found = clientsHook.clients.find(c => c.id === id);
    if (!found) return;

    const bal = clientsHook.getClientBalance(found);

    if (bal !== 0) {
      alert('Saldo deve ser zero para arquivar.');
      return;
    }

  const confirmClose = window.confirm('Fechar a conta e gerar fatura? Esta ação arquiva os lançamentos atuais.');
  if (!confirmClose) return;

  const invoiceNumber = `FAT-${invoiceCounter.toString().padStart(4, '0')}`;
    const nextInvoiceCounter = invoiceCounter + 1;

    // Arquivar conta usando o hook de clientes
    clientsHook.archiveClientAccount(id, invoiceNumber);
    setInvoiceCounter(nextInvoiceCounter);

    // Definir cliente selecionado e navegar para o arquivo (para mostrar a fatura)
    clientsHook.setSelectedClientId(id);
    uiHook.setView('client-archive' as any);

    // Gerar visualização da fatura imediatamente usando os dados que foram arquivados
    const archiveData = {
      dateClosed: new Date().toISOString(),
      transactions: [...found.activeAccount],
      invoiceNumber
    };

    // Tentar abrir a fatura em nova janela (não bloquear se falhar)
    handleViewInvoice(found, archiveData);

    // Criar backup automático usando o hook de backup
    backupHook.saveAllData(
      user,
      clientsHook.clients,
      uiHook.settings,
      manualFloatAdjustments,
      nextInvoiceCounter
    );

    alert(`✅ Conta arquivada com sucesso!\nNúmero da fatura: ${invoiceNumber}`);
  };

  // Visualizar fatura (abre modal com opções)
  const handleViewInvoice = async (client: any, archiveData: any) => {
    try {
      // Abrir modal de fatura
      uiHook.setCurrentInvoiceData({ client, archiveData });
      uiHook.setShowInvoiceModal(true);
    } catch (error: any) {
      console.error('Erro ao visualizar fatura:', error);
      alert('Erro ao visualizar fatura. Verifique o console para mais detalhes.');
    }
  };

  const handleEditTransaction = (updatedTx: any) => {
    if (!clientsHook.selectedClient) return;
    
    // Atualizar transação usando o hook de transações
    const updatedTransaction = transactionsHook.updateTransaction(
      transactionsHook.editingTransaction!,
      updatedTx
    );
    
    // Atualizar no cliente usando o hook de clientes
    clientsHook.updateClientTransaction(
      clientsHook.selectedClient.id,
      updatedTransaction.id,
      updatedTransaction
    );
    
    transactionsHook.setShowEditTransactionModal(false);
    transactionsHook.setEditingTransaction(null);
    
    // Salvar dados
    backupHook.saveAllData(
      user,
      clientsHook.clients,
      uiHook.settings,
      manualFloatAdjustments,
      invoiceCounter
    );
  };

  // Enviar SMS de confirmação / cobrança / extrato usando os helpers de transações
  const handleSendTransactionConfirmation = (tx: any) => {
    if (!clientsHook.selectedClient) return;
    transactionsHook.sendTransactionConfirmation(
      tx,
      clientsHook.selectedClient.phone,
      uiHook.settings.currency,
      uiHook.settings.smsTemplates.confirmation
    );
  };

  const handleSendSMSDebtReminder = () => {
    if (!clientsHook.selectedClient) return;
    const balance = clientsHook.getClientBalance(clientsHook.selectedClient);
    transactionsHook.sendDebtReminder(
      clientsHook.selectedClient.phone,
      balance,
      uiHook.settings.currency,
      uiHook.settings.smsTemplates.debtReminder
    );
  };

  const handleSendStatementSMS = () => {
    if (!clientsHook.selectedClient) return;
    const balance = clientsHook.getClientBalance(clientsHook.selectedClient);
    transactionsHook.sendStatementSMS(
      clientsHook.selectedClient.phone,
      clientsHook.selectedClient.name,
      clientsHook.selectedClient.activeAccount,
      balance,
      uiHook.settings.currency
    );
  };

  const handleCreateAutomaticBackup = () => {
    backupHook.saveAllData(
      user,
      clientsHook.clients,
      uiHook.settings,
      manualFloatAdjustments,
      invoiceCounter
    );
  };

  // Função para importar backup
  const handleImportBackup = async () => {
    const importedData = await backupHook.handleImportLocalDataClick();
    
    if (importedData) {
      // Atualizar todos os estados com os dados importados
      setUser(importedData.user);
      clientsHook.setClients(importedData.clients);
      uiHook.setSettings(importedData.settings);
      setManualFloatAdjustments(importedData.manualFloatAdjustments);
      setInvoiceCounter(importedData.invoiceCounter);
      
      // Recarregar a página para garantir que tudo está sincronizado
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Carregar dados iniciais
  const loadInitialData = async () => {
    const data = await backupHook.loadSavedData();

    if (data.user) setUser(data.user);
    if (data.clients.length > 0) clientsHook.setClients(data.clients);
    if (data.settings) uiHook.setSettings(data.settings);
    if (data.manualFloatAdjustments) {
      setManualFloatAdjustments(prev => ({
        ...prev,
        ...data.manualFloatAdjustments
      }));
    }
    if (data.invoiceCounter > 0) setInvoiceCounter(data.invoiceCounter);

    // Restaurar cliente selecionado (persistido)
    if (data.selectedClientId) {
      clientsHook.setSelectedClientId(data.selectedClientId);
    }

    // Sempre abrir a aba inicial após um refresh
    try { uiHook.setView('dashboard' as any); } catch (e) {}
  };

  // Executar carga inicial ao montar
  useEffect(() => {
    loadInitialData();
    // Firebase removed for offline-only app
  }, []);

  // ============ RETORNO DO HOOK ============
  // Salvar automaticamente quando dados principais mudam (debounced)
  useEffect(() => {
    let timer: any = null;
    timer = setTimeout(() => {
      try {
        backupHook.saveAllData(
          user,
          clientsHook.clients,
          uiHook.settings,
          manualFloatAdjustments,
          invoiceCounter
        );
      } catch (e) {
        // Silenciar erros de save automático
      }
    }, 500);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [user, clientsHook.clients, uiHook.settings, manualFloatAdjustments, invoiceCounter]);
  return {
    // Estados principais
    user, setUser,
    manualFloatAdjustments, setManualFloatAdjustments,
    invoiceCounter, setInvoiceCounter,
    
    // Dados computados globais
    agentBalances,
    
    // Funções compostas
    handleCloseAccount,
    handleEditTransaction,
    handleCreateAutomaticBackup,
    handleImportBackup,
    handleViewInvoice,
    handleSendTransactionConfirmation,
    handleSendSMSDebtReminder,
    handleSendStatementSMS,
    loadInitialData,
    
    // Spread de todos os hooks
    ...clientsHook,
    ...transactionsHook,
    ...backupHook,
    ...uiHook
  };
};