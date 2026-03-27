/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from 'react';

// Approximate rates relative to USD (updated periodically - for display purposes)
export const CURRENCIES = {
  USD: { symbol: '$',  rate: 1,       label: 'USD – US Dollar' },
  EUR: { symbol: '€',  rate: 0.92,    label: 'EUR – Euro' },
  GBP: { symbol: '£',  rate: 0.79,    label: 'GBP – British Pound' },
  INR: { symbol: '₹',  rate: 83.12,   label: 'INR – Indian Rupee' },
  JPY: { symbol: '¥',  rate: 151.60,  label: 'JPY – Japanese Yen' },
  CAD: { symbol: 'CA$', rate: 1.36,   label: 'CAD – Canadian Dollar' },
  AUD: { symbol: 'A$',  rate: 1.53,   label: 'AUD – Australian Dollar' },
  CHF: { symbol: 'Fr',  rate: 0.90,   label: 'CHF – Swiss Franc' },
  CNY: { symbol: '¥',  rate: 7.23,    label: 'CNY – Chinese Yuan' },
  AED: { symbol: 'د.إ', rate: 3.67,   label: 'AED – UAE Dirham' },
};

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('fintrack-currency') || 'USD';
  });

  const handleSetCurrency = (code) => {
    setCurrency(code);
    localStorage.setItem('fintrack-currency', code);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, currencies: CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
};
