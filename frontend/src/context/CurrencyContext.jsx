import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

const RATES = {
  INR: { symbol: '₹', rate: 1, label: 'INR (₹)' },
  USD: { symbol: '$', rate: 0.012, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.011, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.0095, label: 'GBP (£)' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('INR');

  const formatPrice = (priceInINR) => {
    const config = RATES[currency] || RATES.INR;
    const converted = priceInINR * config.rate;
    if (currency === 'INR') {
      return `${config.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${config.symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, RATES }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
