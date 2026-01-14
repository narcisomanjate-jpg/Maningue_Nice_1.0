// src/hooks/useClients.ts
import { useState, useCallback, useMemo } from 'react';
import { useEffect } from 'react';
import localforage from 'localforage';
import { Client, Transaction } from '../types';
import { getClientBalance as calculateBalance } from '../utils/clientUtils';

export const useClients = (initialClients: Client[] = []) => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const [showEditClient, setShowEditClient] = useState(false);

  // Cliente selecionado
  const selectedClient = useMemo(() => 
    clients.find(c => c.id === selectedClientId), 
    [clients, selectedClientId]
  );

  // Persistir seleção de cliente para sobreviver a reloads
  useEffect(() => {
    try {
      localforage.setItem('agent_selected_client_id', selectedClientId);
    } catch (error) {
      // Silenciar
    }
  }, [selectedClientId]);

  // Calcular saldo do cliente
  const getClientBalance = useCallback((client: Client): number => {
    return calculateBalance(client);
  }, []);

  // Filtrar clientes
  const filteredClients = useMemo(() => {
    // Ordenar clientes por nome
    const sortedClients = [...clients].sort((a, b) => 
      a.name.localeCompare(b.name, 'pt', { sensitivity: 'base' })
    );
    
    if (!searchQuery) {
      // Sem pesquisa: mostrar apenas clientes com saldo ≠ 0
      return sortedClients.filter(client => {
        const balance = getClientBalance(client);
        return balance !== 0;
      });
    }
    
    // Com pesquisa: mostrar todos que correspondem
    return sortedClients.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.phone.includes(searchQuery)
    );
  }, [clients, searchQuery, getClientBalance]);

  // Adicionar cliente
  const addClient = (client: Omit<Client, 'id' | 'activeAccount' | 'archive'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      activeAccount: [],
      archive: []
    };
    
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  // Atualizar cliente
  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => 
      prev.map(client => 
        client.id === id ? { ...client, ...updates } : client
      )
    );
  };

  // Remover cliente
  const removeClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  // Adicionar transação ao cliente
  const addTransactionToClient = (clientId: string, transaction: Transaction) => {
    setClients(prev => 
      prev.map(client => 
        client.id === clientId 
          ? { 
              ...client, 
              activeAccount: [...client.activeAccount, transaction] 
            } 
          : client
      )
    );
  };

  // Atualizar transação do cliente
  const updateClientTransaction = (clientId: string, transactionId: string, updates: Partial<Transaction>) => {
    setClients(prev => 
      prev.map(client => {
        if (client.id !== clientId) return client;
        
        return {
          ...client,
          activeAccount: client.activeAccount.map(tx => 
            tx.id === transactionId ? { ...tx, ...updates } : tx
          ),
          archive: client.archive.map(archive => ({
            ...archive,
            transactions: archive.transactions.map(tx => 
              tx.id === transactionId ? { ...tx, ...updates } : tx
            )
          }))
        };
      })
    );
  };

  // Arquivar conta do cliente
  const archiveClientAccount = (clientId: string, invoiceNumber: string) => {
    setClients(prev => 
      prev.map(client => {
        if (client.id !== clientId) return client;
        
        return {
          ...client,
          archive: [{
            dateClosed: new Date().toISOString(),
            transactions: [...client.activeAccount],
            invoiceNumber
          }, ...client.archive],
          activeAccount: []
        };
      })
    );
  };

  return {
    // Estados
    clients,
    setClients,
    selectedClientId,
    setSelectedClientId,
    searchQuery,
    setSearchQuery,
    showAddClient,
    setShowAddClient,
    showEditClient,
    setShowEditClient,
    
    // Dados computados
    selectedClient,
    filteredClients,
    
    // Funções
    getClientBalance,
    addClient,
    updateClient,
    removeClient,
    addTransactionToClient,
    updateClientTransaction,
    archiveClientAccount
  };
};