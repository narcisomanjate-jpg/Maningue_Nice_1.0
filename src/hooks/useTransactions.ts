// src/hooks/useTransactions.ts
import { useState, useCallback } from 'react';
import { Transaction } from '../types';

export const useTransactions = () => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showEditTransactionModal, setShowEditTransactionModal] = useState(false);
  const [selectedTransactionForOptions, setSelectedTransactionForOptions] = useState<string | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState<{ 
    show: boolean, 
    type: 'Inflow' | 'Outflow' | null 
  }>({ show: false, type: null });
  const [showSMSConfirmModal, setShowSMSConfirmModal] = useState<{ 
    show: boolean, 
    tx: Transaction | null 
  }>({ show: false, tx: null });
  const [showSMSOptionsModal, setShowSMSOptionsModal] = useState(false);

  // Criar nova transação
  const createTransaction = (
    amount: number,
    type: 'Inflow' | 'Outflow',
    method: string,
    description?: string
  ): Transaction => {
    return {
      id: Date.now().toString(),
      amount,
      type,
      method,
      description: description || type,
      date: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      settled: false
    };
  };

  // Editar transação
  const updateTransaction = (
    oldTransaction: Transaction,
    updates: Partial<Transaction>
  ): Transaction => {
    return {
      ...oldTransaction,
      ...updates,
      id: oldTransaction.id // Garantir que o ID não mude
    };
  };

  // Enviar confirmação de transação via SMS
  const sendTransactionConfirmation = useCallback((
    tx: Transaction,
    clientPhone: string,
    currency: string,
    smsTemplate: string
  ) => {
    const text = smsTemplate
      .replace('{amount}', tx.amount.toString())
      .replace('{currency}', currency)
      .replace('{desc}', tx.description || tx.type);
    const separator = /iPhone|iPad|iPod/.test(navigator.userAgent) ? '&' : '?';
    const url = `sms:${clientPhone}${separator}body=${encodeURIComponent(text)}`;
    try {
      // Tentar abrir em nova janela (recomendado em mobile)
      const opened = window.open(url, '_blank');
      if (!opened) window.location.href = url;
    } catch (e) {
      window.location.href = url;
    }
  }, []);

  // Enviar lembrete de dívida via SMS
  const sendDebtReminder = useCallback((
    clientPhone: string,
    balance: number,
    currency: string,
    smsTemplate: string
  ) => {
    const text = smsTemplate
      .replace('{amount}', balance.toString())
      .replace('{currency}', currency);
    
    const separator = /iPhone|iPad|iPod/.test(navigator.userAgent) ? '&' : '?';
    const url = `sms:${clientPhone}${separator}body=${encodeURIComponent(text)}`;
    try {
      const opened = window.open(url, '_blank');
      if (!opened) window.location.href = url;
    } catch (e) {
      window.location.href = url;
    }
  }, []);

  // Enviar extrato via SMS
  const sendStatementSMS = useCallback((
    clientPhone: string,
    clientName: string,
    transactions: Transaction[],
    balance: number,
    currency: string
  ) => {
    // Formatar hora
    const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' });
    };

    // Gerar extrato
    let statement = `Extrato de ${clientName}:\n\n`;
    
    transactions.forEach((tx, index) => {
      const date = new Date(tx.date).toLocaleDateString('pt-MZ');
      const time = formatTime(tx.date);
      const type = tx.type === 'Inflow' ? 'Entrada' : 'Saída';
      const sign = tx.type === 'Inflow' ? '+' : '-';
      
      statement += `${index + 1}. ${date} ${time} - ${tx.description || type}\n`;
      statement += `   ${sign}${tx.amount.toLocaleString()} ${currency} (${tx.method})\n\n`;
    });
    
    statement += `\nSALDO ATUAL: ${balance.toLocaleString()} ${currency}`;
    
    const separator = /iPhone|iPad|iPod/.test(navigator.userAgent) ? '&' : '?';
    const url = `sms:${clientPhone}${separator}body=${encodeURIComponent(statement)}`;
    try {
      const opened = window.open(url, '_blank');
      if (!opened) window.location.href = url;
    } catch (e) {
      window.location.href = url;
    }
  }, []);

  // Manipular clique na transação
  const handleTransactionClick = (txId: string) => {
    setSelectedTransactionForOptions(prev => prev === txId ? null : txId);
  };

  return {
    // Estados
    editingTransaction,
    setEditingTransaction,
    showEditTransactionModal,
    setShowEditTransactionModal,
    selectedTransactionForOptions,
    setSelectedTransactionForOptions,
    showTransactionModal,
    setShowTransactionModal,
    showSMSConfirmModal,
    setShowSMSConfirmModal,
    showSMSOptionsModal,
    setShowSMSOptionsModal,
    
    // Funções
    createTransaction,
    updateTransaction,
    sendTransactionConfirmation,
    sendDebtReminder,
    sendStatementSMS,
    handleTransactionClick
  };
};