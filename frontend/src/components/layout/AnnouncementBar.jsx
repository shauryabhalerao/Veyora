import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';

export const AnnouncementBar = () => {
  const { currency, setCurrency, RATES } = useCurrency();

  return (
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
          <span className="text-gray-300">|</span>
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
  );
};
