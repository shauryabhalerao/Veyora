import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Camera, ArrowRight, Star, ShieldCheck, Truck, RotateCcw, ChevronRight } from 'lucide-react';
import { initialProducts, HERO_IMAGE } from '../data/catalog';
import { ProductCard } from '../components/ui/ProductCard';
import { QuickViewModal } from '../components/ui/QuickViewModal';

export const HomePage = () => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Circular Categories featuring real product assets
  const circularCategories = [
    {
      name: "Men",
      itemsCount: "11 Products",
      image: initialProducts[0]?.image,
      link: "/shop?gender=Men"
    },
    {
      name: "Women",
      itemsCount: "11 Products",
      image: initialProducts[11]?.image,
      link: "/shop?gender=Women"
    },
    {
      name: "Kids",
      itemsCount: "8 Products",
      image: initialProducts[22]?.image,
      link: "/shop?gender=Kids"
    },
    {
      name: "Co-ords",
      itemsCount: "2 Sets",
      image: initialProducts[12]?.image,
      link: "/shop?category=Co-ord Sets"
    },
    {
      name: "Shirts",
      itemsCount: "5 Items",
      image: initialProducts[1]?.image,
      link: "/shop?category=Shirts"
    },
    {
      name: "Dresses",
      itemsCount: "4 Items",
      image: initialProducts[17]?.image,
      link: "/shop?category=Dresses"
    }
  ];

  const featuredProducts = initialProducts.slice(0, 6);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Editorial Hero Slider Section matching image reference exactly */}
      <section className="relative bg-[#FAF7F2] overflow-hidden border-b border-[#E8E1D5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          
          <div className="space-y-6 z-10">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6D46] block">
              Best Collection
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1C1917] leading-[1.08]">
              Quiet luxury, <br />
              <span className="italic font-normal">loudly considered.</span>
            </h1>
            <p className="text-sm md:text-base text-[#78716C] max-w-md leading-relaxed">
              Explore premium clothing and statement accessories curated for every season, every style, and every occasion.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/shop"
                className="px-8 py-4 bg-[#1C1917] text-[#FAF7F2] text-xs font-bold uppercase tracking-widest hover:bg-[#8C6D46] transition-all shadow-soft"
              >
                SHOP THE EDIT
              </Link>
              <Link
                to="/lookbook"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1C1917] hover:text-[#8C6D46] py-4 transition-colors"
              >
                View Lookbook →
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-elevated border border-[#E8E1D5] bg-[#F5F0E6]">
              <img
                src={HERO_IMAGE}
                alt="Quiet Luxury Editorial Collection"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80";
                }}
              />
            </div>
          </div>

        </div>

        {/* Circular Categories Bar (Matching image reference exactly) */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 border-t border-[#E8E1D5] bg-[#FAF7F2]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E1D5]">
            {circularCategories.map((cat, idx) => (
              <Link 
                key={idx}
                to={cat.link}
                className="flex flex-col items-center text-center group pt-4 sm:pt-0 sm:px-2"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#E8E1D5] group-hover:border-[#1C1917] transition-all shadow-soft mb-3 bg-[#F5F0E6]">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h4 className="font-serif font-bold text-base text-[#1C1917] group-hover:text-[#8C6D46] transition-colors">{cat.name}</h4>
                <span className="text-[11px] text-[#78716C]">{cat.itemsCount}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-gradient-to-r from-[#1C1917] to-[#2E2824] text-white rounded-2xl p-8 md:p-12 shadow-elevated border border-[#C5A059]/30 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Fashion Engine
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                AI Personal Stylist & Visual Outfit Matcher
              </h2>
              <p className="text-xs sm:text-sm text-[#A8A095] leading-relaxed max-w-md">
                Enter your event occasion and budget for an instant catalog outfit, or upload any photo screenshot to find identical in-stock clothing at Veyora.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-ai-stylist'))}
                  className="px-5 py-3 bg-[#C5A059] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#A87C38] transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Open AI Stylist
                </button>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-find-look'))}
                  className="px-5 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 text-xs font-bold uppercase tracking-widest rounded hover:bg-white/20 transition-colors flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" /> Find This Look
                </button>
              </div>
            </div>

            {/* AI Mock Card Preview */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/15 text-white space-y-3">
              <div className="flex items-center justify-between text-xs text-[#C5A059]">
                <span>Sample Prompt Answer</span>
                <span>Gemini Vision 1.5</span>
              </div>
              <p className="italic text-xs text-gray-200">"I have a college farewell, budget ₹3000, I want a classy outfit."</p>
              <div className="pt-2 border-t border-white/10 text-xs space-y-1">
                <div className="flex justify-between font-bold"><span>✨ Top: Pure Chanderi Silk Kurti</span><span>₹2,999</span></div>
                <div className="flex justify-between text-gray-300"><span>Bottom: Tailored White Trousers</span><span>₹1,899</span></div>
                <div className="flex justify-between text-gray-300"><span>Footwear: Suede Loafers</span><span>₹3,699</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Gender Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6D46]">Curated Edits</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1C1917]">Shop by Collection</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Women */}
          <Link to="/shop?gender=Women" className="group relative aspect-[3/4] rounded-xl overflow-hidden shadow-soft border border-[#E8E1D5]">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80" alt="Women" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-8 flex flex-col justify-end text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">160+ Styles</span>
              <h3 className="font-serif text-3xl font-bold mt-1">Women Atelier</h3>
              <p className="text-xs text-gray-200 mt-2">Silk dresses, tailored blazers, kurtis & co-ords.</p>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest mt-4 group-hover:translate-x-1 transition-transform">
                Explore Women →
              </span>
            </div>
          </Link>

          {/* Men */}
          <Link to="/shop?gender=Men" className="group relative aspect-[3/4] rounded-xl overflow-hidden shadow-soft border border-[#E8E1D5]">
            <img src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80" alt="Men" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-8 flex flex-col justify-end text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">120+ Styles</span>
              <h3 className="font-serif text-3xl font-bold mt-1">Men Collection</h3>
              <p className="text-xs text-gray-200 mt-2">Linen overshirts, silk kurtas & suede loafers.</p>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest mt-4 group-hover:translate-x-1 transition-transform">
                Explore Men →
              </span>
            </div>
          </Link>

          {/* Kids */}
          <Link to="/shop?gender=Kids" className="group relative aspect-[3/4] rounded-xl overflow-hidden shadow-soft border border-[#E8E1D5]">
            <img src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80" alt="Kids" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-8 flex flex-col justify-end text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">80+ Styles</span>
              <h3 className="font-serif text-3xl font-bold mt-1">Kids & Infants</h3>
              <p className="text-xs text-gray-200 mt-2">Organic cotton floral dresses & gentleman sets.</p>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest mt-4 group-hover:translate-x-1 transition-transform">
                Explore Kids →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-[#E8E1D5] pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6D46]">Trending Styles</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1C1917]">New Arrivals & Best Sellers</h2>
          </div>
          <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-[#1C1917] hover:text-[#8C6D46] transition-colors mt-2 md:mt-0">
            View All Products ({initialProducts.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickView={(p) => setQuickViewProduct(p)} 
            />
          ))}
        </div>
      </section>

      {/* Render Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />

    </div>
  );
};
