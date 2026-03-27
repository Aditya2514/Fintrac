/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance-transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('finance-budget');
    const parsed = saved ? JSON.parse(saved) : {};
    return {
      amount: parsed.amount || 0,
      categories: parsed.categories || {}
    };
  });

  useEffect(() => {
    localStorage.setItem('finance-transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance-budget', JSON.stringify(budget));
  }, [budget]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: uuidv4(),
      amount: parseFloat(transaction.amount) // ensure it's a number
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id, updatedData) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updatedData, amount: parseFloat(updatedData.amount) } : t))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateBudget = (updates) => {
    setBudget(prev => ({ ...prev, ...updates }));
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budget,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudget
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
