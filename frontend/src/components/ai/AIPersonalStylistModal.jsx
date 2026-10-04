import React, { useState, useEffect } from 'react';
import { Sparkles, X, ShoppingBag, RefreshCw, CheckCircle2 } from 'lucide-react';
import { initialProducts } from '../../data/catalog';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../context/ToastContext';
import { apiClient } from '../../utils/apiClient';

export const AIPersonalStylistModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('I have a college farewell, budget ₹3000, I want a classy outfit.');
  const [loading, setLoading] = useState(false);
  const [outfitResult, setOutfitResult] = useState(null);

  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { addToast } = useToast();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-stylist', handleOpen);
    return () => window.removeEventListener('open-ai-stylist', handleOpen);
  }, []);

  const samplePrompts = [
    "I have a college farewell, budget ₹3000, I want a classy outfit.",
    "Festive wedding guest look for Men under ₹4500",
    "Casual summer resort wear for Women under ₹4000",
    "Smart office meeting look under ₹5000"
  ];

  const [error, setError] = useState(null);

  const handleGenerateOutfit = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setOutfitResult(null);

    try {
      // Call Backend Gemini AI API using apiClient
      const data = await apiClient('/ai/stylist', {
        method: 'POST',
        body: JSON.stringify({
          message: prompt,
          prompt: prompt,
          gender: prompt.toLowerCase().includes('men') ? 'men' : prompt.toLowerCase().includes('kids') ? 'kids' : 'women'
        })
      });

      if (data && data.success !== false) {
        setOutfitResult(data);
      } else {
        const errorMsg = data?.error || data?.message || 'Failed to generate styling recommendation from Gemini AI.';
        setError(errorMsg);
        addToast(errorMsg, 'error');
      }
    } catch (err) {
      console.error("AI Stylist error:", err);
      const networkErr = err.message || 'Unable to connect to backend AI server. Please check your connection and retry.';
      setError(networkErr);
      addToast(networkErr, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFullOutfitToCart = () => {
    if (!outfitResult?.items) return;
    outfitResult.items.forEach(item => {
      addToCart(item, item.colors?.[0]?.name, item.sizes?.[0], 1);
    });
    addToast(`All ${outfitResult.items.length} items added to your Bag!`, 'success');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-2xl shadow-elevated border border-[#E8E1D5] overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-[#F9ECE6] border-b border-[#E8E1D5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1C1917] text-white flex items-center justify-center shadow-soft">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">AI Personal Stylist</h3>
              <p className="text-xs text-[#78716C]">Powered by Gemini AI · Catalog-synced styling</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Prompt Form */}
          <form onSubmit={handleGenerateOutfit} className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#8C6D46] block">
              Describe your occasion, budget & style preference:
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows="3"
                className="w-full bg-white p-3.5 rounded-lg border border-[#E8E1D5] text-sm text-[#1C1917] focus:outline-none focus:border-[#1C1917] transition-all"
                placeholder="e.g. I have a college farewell, budget ₹3000, I want a classy outfit."
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute bottom-3 right-3 px-4 py-2 bg-[#1C1917] text-white text-xs font-bold rounded-md hover:bg-[#8C6D46] transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {loading ? 'Curating...' : 'Generate Look'}
              </button>
            </div>

            {/* Prompt Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {samplePrompts.map((sp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(sp)}
                  className="text-[11px] px-2.5 py-1 bg-white border border-[#E8E1D5] hover:border-[#1C1917] rounded-full text-[#78716C] transition-all"
                >
                  "{sp}"
                </button>
              ))}
            </div>
          </form>

          {/* Skeleton Loader */}
          {loading && (
            <div className="p-8 bg-white rounded-xl border border-[#E8E1D5] text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#8C6D46] animate-spin mx-auto" />
              <h4 className="font-serif font-bold text-lg text-[#1C1917]">Curating catalog matching outfit...</h4>
              <p className="text-xs text-[#78716C]">Analyzing silhouette, budget limits, color theory and in-stock inventory...</p>
            </div>
          )}

          {/* Error Message with Retry */}
          {error && !loading && (
            <div className="p-6 bg-rose-50 rounded-xl border border-rose-200 text-center space-y-3 shadow-soft">
              <div className="text-rose-700 font-bold text-sm">AI Stylist Error</div>
              <p className="text-xs text-rose-800 leading-relaxed">{error}</p>
              <button
                type="button"
                onClick={handleGenerateOutfit}
                className="px-4 py-2 bg-rose-900 text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-rose-950 transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Request
              </button>
            </div>
          )}

          {/* AI Result Card */}
          {outfitResult && !loading && (
            <div className="bg-white rounded-xl border border-[#E8E1D5] p-6 space-y-5 animate-slide-up shadow-soft">
              <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D46]">Curated Outfit Recommendation</span>
                  <h4 className="font-serif text-2xl font-bold text-[#1C1917]">{outfitResult.title}</h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#78716C]">Total Price</span>
                  <div className="font-serif text-xl font-bold text-[#1C1917]">{formatPrice(outfitResult.totalPrice)}</div>
                </div>
              </div>

              {/* Items Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {outfitResult.items.map((item) => (
                  <div key={item.id} className="bg-[#FAF7F2] p-3 rounded-lg border border-[#E8E1D5] text-center space-y-2">
                    <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded" />
                    <h5 className="font-serif text-sm font-bold text-[#1C1917] truncate">{item.name}</h5>
                    <span className="text-xs text-[#78716C] block">{item.category}</span>
                    <span className="text-xs font-bold text-[#1C1917] block">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>

              {/* Why it works */}
              <div className="bg-[#F9ECE6] p-4 rounded-lg border border-[#E8E1D5]">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#8C6D46] flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4" /> Why This Outfit Works:
                </h5>
                <p className="text-xs text-[#1C1917] leading-relaxed">{outfitResult.whyItWorks}</p>
              </div>

              {/* Alternatives */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#78716C] block mb-2">Alternative Options</span>
                <div className="flex gap-3 text-xs">
                  {outfitResult.alternatives?.map((alt, i) => (
                    <div key={i} className="px-3 py-1.5 bg-[#F3EFE6] rounded border border-[#E8E1D5] flex items-center justify-between w-full">
                      <span className="truncate">{alt.name}</span>
                      <span className="font-bold text-[#8C6D46] ml-2">{formatPrice(alt.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add All To Cart Action */}
              <button
                onClick={handleAddFullOutfitToCart}
                className="w-full py-3.5 bg-[#1C1917] text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#8C6D46] transition-colors flex items-center justify-center gap-2 shadow-soft"
              >
                <ShoppingBag className="w-4 h-4" /> Add Complete Outfit to Bag ({formatPrice(outfitResult.totalPrice)})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
