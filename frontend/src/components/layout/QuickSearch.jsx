import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, Sparkles } from 'lucide-react';
import { initialProducts } from '../../data/catalog';
import { useCurrency } from '../../context/CurrencyContext';

export const QuickSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? initialProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.gender.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const popularSearches = ["Silk Kurti", "Structured Blazer", "Wide Leg Trousers", "Linen Shirt", "Ethnic Wear", "Loafers"];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-16 px-4 animate-fade-in">
      <div className="bg-[#FAF7F2] w-full max-w-3xl rounded-xl shadow-elevated border border-[#E8E1D5] overflow-hidden">
        {/* Search Header Input */}
        <form onSubmit={handleSearchSubmit} className="p-4 border-b border-[#E8E1D5] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#8C6D46]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dresses, blazers, kurtis, loafers..."
            autoFocus
            className="w-full bg-transparent text-lg text-[#1C1917] focus:outline-none placeholder-[#78716C]"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="p-1 hover:bg-[#F3EFE6] rounded-full">
              <X className="w-4 h-4 text-[#78716C]" />
            </button>
          )}
          <button 
            type="button" 
            onClick={onClose}
            className="text-xs font-bold uppercase tracking-widest text-[#78716C] hover:text-[#1C1917] px-2 py-1"
          >
            Esc
          </button>
        </form>

        {/* Results / Suggestions */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {!query.trim() ? (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8C6D46] mb-3">
                <TrendingUp className="w-4 h-4" /> Trending Searches
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {popularSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(item);
                    }}
                    className="px-3 py-1.5 bg-[#F3EFE6] hover:bg-[#1C1917] hover:text-white border border-[#E8E1D5] rounded-full text-xs font-medium transition-all"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-[#F9ECE6] rounded-lg border border-[#E8E1D5] flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-[#1C1917] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#8C6D46]" /> Looking for outfit matching?
                  </h4>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    Try our AI Personal Stylist or Upload a Photo with Find This Look!
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent('open-ai-stylist'));
                  }}
                  className="px-3 py-1.5 bg-[#1C1917] text-white text-xs font-bold rounded hover:bg-[#8C6D46] transition-colors"
                >
                  Ask AI Stylist ✨
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-4">
                Products found ({filteredProducts.length})
              </div>
              {filteredProducts.length === 0 ? (
                <div className="py-8 text-center text-[#78716C]">
                  <p>No exact matching products found for "{query}".</p>
                  <p className="text-xs mt-1">Try searching for broad terms like "Kurti", "Dress", "Blazer", or "Shoes".</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        navigate(`/product/${product.id}`);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#E8E1D5] hover:shadow-soft cursor-pointer transition-all"
                    >
                      <img src={product.image} alt={product.name} className="w-14 h-18 object-cover rounded bg-gray-100" />
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C6D46]">{product.gender} · {product.category}</span>
                        <h5 className="font-serif font-bold text-sm text-[#1C1917]">{product.name}</h5>
                        <p className="text-xs font-semibold text-[#1C1917] mt-1">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
