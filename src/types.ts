	//	types.ts
	
export type PaymentMethod = 'Cash' | 'M-pesa' | 'E-mola' | 'Super M-pesa' | 'Super E-mola' | 'Mkesh' | string;

export interface Transaction {
  id: string;
  type: 'Inflow' | 'Outflow';
  amount: number;
  method: PaymentMethod;
  date: string;
  dueDate: string;
  description: string;
  settled: boolean;
}

export interface ArchiveEntry {
  dateClosed: string;
  transactions: Transaction[];
  invoiceNumber?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  activeAccount: Transaction[];
  archive: ArchiveEntry[];
}

export interface UserProfile {
  name: string;
  isFirstTime: boolean;
  email?: string;
}

export interface UIConfig {
  primaryColor: string;
  transparency: number;
}

export interface SMSConfig {
  confirmation: string;
  debtReminder: string;
}

export interface AppSettings {
  language: 'pt' | 'en';
  theme: 'light' | 'dark';
  currency: string;
  enabledAccounts: PaymentMethod[];
  accountColors: Record<string, string>;
  inactiveAccounts?: string[];
  uiConfig: UIConfig;
  smsTemplates: SMSConfig;
}

export type ViewState = 'dashboard' | 'clients' | 'client-detail' | 'client-archive' | 'settings';
