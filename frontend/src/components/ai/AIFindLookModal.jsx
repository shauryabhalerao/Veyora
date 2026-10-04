import React, { useState, useEffect } from 'react';
import { Camera, Upload, X, Sparkles, ShoppingBag } from 'lucide-react';
import { initialProducts } from '../../data/catalog';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../context/ToastContext';
import { apiClient } from '../../utils/apiClient';

export const AIFindLookModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [matchedLook, setMatchedLook] = useState(null);

  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { addToast } = useToast();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-find-look', handleOpen);
    return () => window.removeEventListener('open-find-look', handleOpen);
  }, []);

  // Demo sample visual look uploads
  const sampleUploads = [
    {
      title: "👩 Beige Oversized Blazer + White Top + Black Trousers",
      preview: "https://images.unsplash.com/photo-1548624149-f1af3de65b7d?auto=format&fit=crop&w=600&q=80",
      matchedIds: ['w-02', 'w-05', 'w-04']
    },
    {
      title: "🥻 Silk Kurti & Handcrafted Dupatta",
      preview: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
      matchedIds: ['w-03', 'w-06']
    },
    {
      title: "👨 Linen Over-Jacket + Suede Loafers",
      preview: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
      matchedIds: ['m-01', 'm-02', 'm-05']
    }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        analyzeUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectSampleLook = (sample) => {
    setImagePreview(sample.preview);
    analyzeUploadedImage(sample.preview, sample.matchedIds);
  };

  const analyzeUploadedImage = async (imgData, overrideIds = null) => {
    setAnalyzing(true);
    setMatchedLook(null);

    try {
      // Send image to backend express server Gemini vision endpoint using apiClient
      const data = await apiClient('/ai/find-look', {
        method: 'POST',
        body: JSON.stringify({ image: imgData })
      });

      if (data && data.products) {
        setMatchedLook(data);
      } else {
        fallbackVisualMatch(overrideIds);
      }
    } catch (err) {
      console.warn("Using smart fallback visual search:", err.message);
      fallbackVisualMatch(overrideIds);
    } finally {
      setAnalyzing(false);
    }
  };

  const fallbackVisualMatch = (overrideIds) => {
    const ids = overrideIds || ['W001', 'W005', 'M011'];
    const matchedProducts = ids.map(id => initialProducts.find(p => p.id === id)).filter(Boolean);
    const totalPrice = matchedProducts.reduce((acc, p) => acc + p.price, 0);

    setMatchedLook({
      analysis: {
        identifiedItems: ["Classic Black Long-Sleeve Top", "Urban Cropped Jacket", "Wide-Leg Black Trousers"],
        dominantColors: ["Obsidian Black", "Beige Taupe", "Jet Black"],
        styleCategory: "Smart Casual / Quiet Luxury"
      },
      products: matchedProducts,
      totalPrice
    });
  };

  const handleAddAllMatchedToCart = () => {
    if (!matchedLook?.products) return;
    matchedLook.products.forEach(item => {
      addToCart(item, item.colors?.[0]?.name, item.sizes?.[0], 1);
    });
    addToast(`Added matched look (${matchedLook.products.length} items) to your Bag!`, 'success');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-2xl shadow-elevated border border-[#E8E1D5] overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-[#F3EFE6] border-b border-[#E8E1D5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1C1917] text-white flex items-center justify-center shadow-soft">
              <Camera className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">Find This Look</h3>
              <p className="text-xs text-[#78716C]">Upload any outfit screenshot · Instant store catalog match</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-full text-[#78716C] hover:text-[#1C1917]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Upload Dropzone */}
          {!imagePreview ? (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-[#D5CBB9] hover:border-[#1C1917] bg-white p-8 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                <Upload className="w-10 h-10 text-[#8C6D46] mb-2" />
                <span className="font-serif text-lg font-bold text-[#1C1917]">Upload Outfit Photo or Screenshot</span>
                <span className="text-xs text-[#78716C] mt-1">Supports JPG, PNG, WEBP files</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#78716C] block mb-2">Or try a sample outfit screenshot:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {sampleUploads.map((sample, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectSampleLook(sample)}
                      className="p-2 bg-white rounded-lg border border-[#E8E1D5] hover:border-[#1C1917] cursor-pointer transition-all flex items-center gap-2"
                    >
                      <img src={sample.preview} alt="Sample" className="w-12 h-14 object-cover rounded bg-gray-100" />
                      <span className="text-xs font-medium text-[#1C1917] line-clamp-2">{sample.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[#E8E1D5]">
              <img src={imagePreview} alt="Uploaded Look" className="w-24 h-32 object-cover rounded shadow-soft border border-[#E8E1D5]" />
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D46]">Uploaded Outfit Photo</span>
                <h4 className="font-serif font-bold text-lg text-[#1C1917]">Visual Search Analysis</h4>
                <p className="text-xs text-[#78716C] mt-1">Gemini AI is parsing garment cuts, colors, and textures...</p>
                <button
                  onClick={() => { setImagePreview(null); setMatchedLook(null); }}
                  className="mt-3 text-xs font-bold uppercase tracking-wider text-rose-700 hover:underline"
                >
                  Upload Different Photo
                </button>
              </div>
            </div>
          )}

          {/* Analyzing State */}
          {analyzing && (
            <div className="p-8 bg-white rounded-xl border border-[#E8E1D5] text-center space-y-2">
              <Sparkles className="w-8 h-8 text-[#8C6D46] animate-bounce mx-auto" />
              <h4 className="font-serif font-bold text-lg text-[#1C1917]">Matching with Veyora Catalog...</h4>
              <p className="text-xs text-[#78716C]">Finding exact & similar clothing items in stock...</p>
            </div>
          )}

          {/* Matched Look Results */}
          {matchedLook && !analyzing && (
            <div className="bg-white rounded-xl border border-[#E8E1D5] p-6 space-y-5 shadow-soft">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D46]">AI Identified Outfit Breakdown</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {matchedLook.analysis.identifiedItems.map((item, i) => (
                    <span key={i} className="px-2.5 py-1 bg-[#F9ECE6] text-[#1C1917] text-xs font-semibold rounded-full border border-[#E8E1D5]">
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Matched Products Grid */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Matching Products Available in Store:</span>
                {matchedLook.products.map((prod) => (
                  <div key={prod.id} className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8E1D5] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-12 h-14 object-cover rounded" />
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#8C6D46]">{prod.brand}</span>
                        <h5 className="font-serif font-bold text-sm text-[#1C1917]">{prod.name}</h5>
                        <span className="text-xs text-[#78716C]">{prod.colors?.[0]?.name} · Size {prod.sizes?.[0]}</span>
                      </div>
                    </div>
                    <div className="font-serif font-bold text-base text-[#1C1917]">
                      {formatPrice(prod.price)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Total & Action */}
              <div className="p-4 bg-[#F3EFE6] rounded-lg border border-[#E8E1D5] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#78716C]">Complete Matched Look Total</span>
                  <div className="font-serif text-2xl font-bold text-[#1C1917]">{formatPrice(matchedLook.totalPrice)}</div>
                </div>
                <button
                  onClick={handleAddAllMatchedToCart}
                  className="px-6 py-3 bg-[#1C1917] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#8C6D46] transition-colors flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add Look to Bag
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
