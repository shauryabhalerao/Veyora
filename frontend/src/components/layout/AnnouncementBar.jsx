import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

export const AnnouncementBar = () => {
  const { currency, setCurrency, RATES } = useCurrency();
  const { serverError, clearServerError, retryAuthInit } = useAuth();

  return (
    <div>
      {serverError && (
        <div className="bg-rose-900 text-white py-2.5 px-4 text-xs font-semibold flex items-center justify-between border-b border-rose-950 animate-fade-in">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center w-full">
            <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
            <span>{serverError}</span>
            <button
              onClick={() => {
                clearServerError();
                if (retryAuthInit) retryAuthInit();
              }}
              className="ml-2 px-2.5 py-0.5 bg-white text-rose-950 rounded text-[11px] font-bold hover:bg-rose-100 transition-colors inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Retry Connection
            </button>
          </div>
          <button onClick={clearServerError} className="text-rose-200 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-[#F9ECE6] text-[#1C1917] py-2 px-4 text-xs tracking-wider uppercase border-b border-[#E8E1D5]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4 text-[11px] font-medium opacity-80">
            <span>COMPLIMENTARY GIFT WRAP ON ALL ORDERS</span>
          </div>
          
          <div className="mx-auto md:mx-0 font-medium text-center text-[11px] tracking-widest">
            FREE SHIPPING OVER ₹3000 — EASY 7-DAY RETURNS & EXCHANGES
          </div>

          <div className="hidden md:flex items-center gap-3 text-[11px]">
            <select 
              value="en" 
              readOnly 
              className="bg-transparent border-none text-[#1C1917] font-medium focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
            <span className="text-[#D5CBB9]">|</span>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent border-none text-[#1C1917] font-semibold focus:outline-none cursor-pointer"
            >
              {Object.keys(RATES).map((curr) => (
                <option key={curr} value={curr}>{RATES[curr].label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
