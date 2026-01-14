// src/utils/clientUtils.ts
import { Client } from '../types';

export const getClientBalance = (client: Client): number => {
  return client.activeAccount.reduce((acc, curr) => 
    curr.type === 'Inflow' ? acc - curr.amount : acc + curr.amount, 
    0
  );
};

export const formatClientBalance = (client: Client, currency: string): string => {
  const balance = getClientBalance(client);
  const formatted = balance.toLocaleString('pt-MZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return `${balance >= 0 ? '+' : ''}${formatted} ${currency}`;
};

export const getClientTransactionStats = (client: Client) => {
  const totalTransactions = client.activeAccount.length + 
    client.archive.reduce((total, arch) => total + arch.transactions.length, 0);
  
  const totalInflow = client.activeAccount
    .filter(tx => tx.type === 'Inflow')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalOutflow = client.activeAccount
    .filter(tx => tx.type === 'Outflow')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  return {
    totalTransactions,
    totalInflow,
    totalOutflow,
    netFlow: totalOutflow - totalInflow
  };
};

export const searchClients = (clients: Client[], query: string): Client[] => {
  if (!query.trim()) return clients;
  
  const lowerQuery = query.toLowerCase();
  
  return clients.filter(client => 
    client.name.toLowerCase().includes(lowerQuery) ||
    client.phone.includes(query) ||
    ((client as any).email && (client as any).email.toLowerCase().includes(lowerQuery)) ||
    ((client as any).notes && (client as any).notes.toLowerCase().includes(lowerQuery))
  );
};