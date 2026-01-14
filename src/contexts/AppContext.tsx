import React, { createContext, ReactNode } from 'react';
import { ViewState, Client, UserProfile, AppSettings, Transaction, PaymentMethod } from '../types';

// Definir o tipo do contexto
export interface AppContextType {
  // ============ ESTADOS PRINCIPAIS ============
  view: ViewState;
  setView: (view: ViewState) => void;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  clients: Client[];
  setClients: (clients: Client[]) => void;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  manualFloatAdjustments: Record<PaymentMethod, number>;
  setManualFloatAdjustments: (adjustments: Record<PaymentMethod, number>) => void;
  invoiceCounter: number;
  setInvoiceCounter: (counter: number) => void;
  
  // ============ ESTADOS DE UI ============
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDark: boolean;
  
  // ============ ESTADOS DE MODAIS ============
  showAddClient: boolean;
  setShowAddClient: (show: boolean) => void;
  showEditClient: boolean;
  setShowEditClient: (show: boolean) => void;
  showTransactionModal: { show: boolean; type: 'Inflow' | 'Outflow' | null };
  setShowTransactionModal: (modal: { show: boolean; type: 'Inflow' | 'Outflow' | null }) => void;
  showSMSConfirmModal: { show: boolean; tx: Transaction | null };
  setShowSMSConfirmModal: (modal: { show: boolean; tx: Transaction | null }) => void;
  showSMSOptionsModal: boolean;
  setShowSMSOptionsModal: (show: boolean) => void;
  showFloatModal: boolean;
  setShowFloatModal: (show: boolean) => void;
  
  // ============ ESTADOS DE EDIÇÃO ============
  editingTransaction: Transaction | null;
  setEditingTransaction: (tx: Transaction | null) => void;
  showEditTransactionModal: boolean;
  setShowEditTransactionModal: (show: boolean) => void;
  selectedTransactionForOptions: string | null;
  setSelectedTransactionForOptions: (id: string | null) => void;
  
  // ============ ESTADOS DE GESTÃO DE CONTAS ============
  isUserBoxOpen: boolean;
  setIsUserBoxOpen: (open: boolean) => void;
  isAccountsBoxOpen: boolean;
  setIsAccountsBoxOpen: (open: boolean) => void;
  newAccName: string;
  setNewAccName: (name: string) => void;
  editingAccountColor: string | null;
  setEditingAccountColor: (color: string | null) => void;
  editingAccountName: string | null;
  setEditingAccountName: (name: string | null) => void;
  
  // Firebase sync removed for offline-only
  
  // ============ DADOS COMPUTADOS ============
  selectedClient: Client | undefined;
  getClientBalance: (client: Client) => number;
  agentBalances: Record<PaymentMethod, number>;
  filteredClients: Client[];
  
  // ============ FUNÇÕES DE UTILIDADE ============
  handleCreateAutomaticBackup: () => void;
  handleCloseAccount: (client: Client) => void;
  handleViewInvoice: (client: Client, archiveData: any) => void;
  handleEditTransaction: (updatedTx: Transaction) => void;
  handleSendTransactionConfirmation: (tx: Transaction) => void;
  handleTransactionClick: (txId: string) => void;
  handleSendSMSDebtReminder: () => void;
  handleSendStatementSMS: () => void;
  toggleAccountStatus: (accountName: string) => void;
  handleEditAccountName: (oldName: string, newName: string) => void;
  handleExportLocalData: (user: UserProfile, clients: Client[], settings: AppSettings, manualFloatAdjustments: Record<PaymentMethod, number>, invoiceCounter: number) => void;
  handleImportLocalDataClick: () => Promise<{
    user: UserProfile;
    clients: Client[];
    settings: AppSettings;
    manualFloatAdjustments: Record<PaymentMethod, number>;
    invoiceCounter: number;
  } | null>;
  // Firebase sync removed for offline-only
  
  // ============ TRADUÇÕES ============
  t: any;
}

// Criar o contexto
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Provedor do contexto
interface AppProviderProps {
  children: ReactNode;
  value: AppContextType;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children, value }) => {
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};