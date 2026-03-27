// src/utils/formatters.js
import { CURRENCIES } from '../context/CurrencyContext';

/**
 * Format a USD-based amount into the selected currency.
 * @param {number} amount - Amount in USD
 * @param {string} currencyCode - ISO currency code (e.g. 'INR')
 */
export const formatCurrency = (amount, currencyCode = 'USD') => {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = amount * curr.rate;
  // JPY and CNY have no decimal places
  const noDecimals = ['JPY', 'CNY'];
  return `${curr.symbol}${converted.toLocaleString('en-US', {
    minimumFractionDigits: noDecimals.includes(currencyCode) ? 0 : 2,
    maximumFractionDigits: noDecimals.includes(currencyCode) ? 0 : 2,
  })}`;
};

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};
