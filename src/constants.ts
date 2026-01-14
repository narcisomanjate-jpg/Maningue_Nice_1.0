	//	constants.ts

import { AppSettings } from './types';

export const INITIAL_SETTINGS: AppSettings = {
  language: 'pt',
  theme: 'light',
  currency: 'MZN',
  enabledAccounts: ['Super M-pesa', 'Super E-mola', 'M-pesa', 'E-mola', 'Mkesh', 'Cash'],
  accountColors: {
    'Super M-pesa': '#3b82f6',
    'Super E-mola': '#f43f5e',
    'M-pesa': '#10b981',
    'E-mola': '#f59e0b',
    'Mkesh': '#06b6d4',
    'Cash': '#6366f1'
  },
  inactiveAccounts: [],
  uiConfig: {
    primaryColor: '#3b82f6',
    transparency: 0.85
  },
  smsTemplates: {
    confirmation: 'Confirmamos a transação de {amount} {currency} - {desc}. Obrigado!',
    debtReminder: 'Lembrete: Saldo pendente de {amount} {currency}. Por favor regularize.'
  }
};

export const translations = {
  pt: {
    // Dashboard
    dash_greeting: 'Olá',
    dash_chart_title: 'Movimentos Diários',
    
    // Navigation
    nav_home: 'Início',
    nav_clients: 'Clientes',
    nav_settings: 'Definições',
    
    // Clientes
    client_search: 'Pesquisar cliente...',
    client_balance_label: 'Saldo',
    client_debt: 'Dívida',
    client_active_ledger: 'Conta Ativa',
    client_archive_title: 'Arquivo',
    client_edit: 'Editar Cliente',
    
    // Transações
    tx_inflow: 'Nova Entrada',
    tx_outflow: 'Nova Saída',
    tx_amount: 'Valor',
    tx_method: 'Método',
    tx_date: 'Data',
    tx_desc: 'Descrição',
    tx_confirm: 'Confirmar',
    tx_cancel: 'Cancelar',
    
    // Modais
    modal_save: 'Guardar',
    confirm_delete: 'Tem certeza que deseja eliminar este cliente?',
    
    // Login/Registo
    login_name: 'Nome completo',
    login_phone: 'Número de telefone',
    
    // SMS
    sms_confirm_prompt: 'Enviar confirmação por SMS?',
    sms_confirm_btn: 'Enviar SMS',
    
    // Arquivo
    archive_empty: 'Nenhum arquivo encontrado',
    archive_date: 'Data de fecho',
    
    // Configurações
    settings_title: 'Definições',
    settings_user_profile: 'Perfil do Utilizador',
    settings_accounts: 'Contas Disponíveis',
    settings_sms: 'Modelos de SMS',
    settings_appearance: 'Aparência',
    settings_darkmode: 'Modo Escuro',
    settings_language: 'Idioma',
    ui_customization: 'Personalização da Interface',
    ui_primary_color: 'Cor Primária',
    ui_transparency: 'Transparência'
  },
  en: {
    // Dashboard
    dash_greeting: 'Hello',
    dash_chart_title: 'Daily Movements',
    
    // Navigation
    nav_home: 'Home',
    nav_clients: 'Clients',
    nav_settings: 'Settings',
    
    // Clients
    client_search: 'Search client...',
    client_balance_label: 'Balance',
    client_debt: 'Debt',
    client_active_ledger: 'Active Account',
    client_archive_title: 'Archive',
    client_edit: 'Edit Client',
    
    // Transactions
    tx_inflow: 'New Inflow',
    tx_outflow: 'New Outflow',
    tx_amount: 'Amount',
    tx_method: 'Method',
    tx_date: 'Date',
    tx_desc: 'Description',
    tx_confirm: 'Confirm',
    tx_cancel: 'Cancel',
    
    // Modals
    modal_save: 'Save',
    confirm_delete: 'Are you sure you want to delete this client?',
    
    // Login/Register
    login_name: 'Full name',
    login_phone: 'Phone number',
    
    // SMS
    sms_confirm_prompt: 'Send confirmation by SMS?',
    sms_confirm_btn: 'Send SMS',
    
    // Archive
    archive_empty: 'No archive found',
    archive_date: 'Closing Date',
    
    // Settings
    settings_title: 'Settings',
    settings_user_profile: 'User Profile',
    settings_accounts: 'Available Accounts',
    settings_sms: 'SMS Templates',
    settings_appearance: 'Appearance',
    settings_darkmode: 'Dark Mode',
    settings_language: 'Language',
    ui_customization: 'UI Customization',
    ui_primary_color: 'Primary Color',
    ui_transparency: 'Transparency'
  }
};