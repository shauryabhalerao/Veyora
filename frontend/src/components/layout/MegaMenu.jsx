import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES_CONFIG } from '../../data/catalog';

export const MegaMenu = ({ category, onClose }) => {
  if (!category || !CATEGORIES_CONFIG[category]) return null;

  const items = CATEGORIES_CONFIG[category];

  return (
    <div 
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#FAF7F2] border-b border-[#E8E1D5] shadow-elevated z-40 py-8 px-12 transition-all duration-200 animate-fade-in"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
        <div>
          <h3 className="font-serif text-lg font-bold tracking-wider uppercase mb-4 text-[#1C1917] border-b border-[#E8E1D5] pb-2">
            Shop {category}
          </h3>
          <ul className="space-y-2 text-sm">
            {items.map((sub, i) => (
              <li key={i}>
                <Link 
                  to={`/shop?gender=${category}&category=${encodeURIComponent(sub)}`}
                  onClick={onClose}
                  className="text-[#78716C] hover:text-[#1C1917] hover:underline transition-colors"
                >
                  {sub}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg font-bold tracking-wider uppercase mb-4 text-[#1C1917] border-b border-[#E8E1D5] pb-2">
            Curated Collections
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to={`/shop?gender=${category}&collection=festive`} onClick={onClose} className="text-[#8C6D46] font-medium hover:underline">
                ✨ Festive Edit 2026
              </Link>
            </li>
            <li>
              <Link to={`/shop?gender=${category}&collection=new`} onClick={onClose} className="text-[#78716C] hover:text-[#1C1917] hover:underline">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link to={`/shop?gender=${category}&collection=bestsellers`} onClick={onClose} className="text-[#78716C] hover:text-[#1C1917] hover:underline">
                Best Sellers
              </Link>
            </li>
            <li>
              <Link to={`/shop?gender=${category}&collection=sale`} onClick={onClose} className="text-rose-700 font-semibold hover:underline">
                End of Season Sale (Up to 40% Off)
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-2 bg-[#F3EFE6] p-6 rounded-lg flex items-center justify-between border border-[#E8E1D5]">
          <div>
            <span className="text-xs font-semibold tracking-widest text-[#8C6D46] uppercase">Editorial Campaign</span>
            <h4 className="font-serif text-2xl font-bold mt-1 text-[#1C1917]">
              Quiet Luxury, Loudly Considered
            </h4>
            <p className="text-xs text-[#78716C] mt-2 max-w-xs">
              Hand-picked organic cottons, mulberry silks, and tailored silhouettes crafted for everyday elevation.
            </p>
            <Link 
              to="/lookbook" 
              onClick={onClose}
              className="inline-block mt-4 text-xs font-bold uppercase tracking-widest bg-[#1C1917] text-white px-5 py-2.5 rounded hover:bg-[#8C6D46] transition-colors"
            >
              Explore Lookbook →
            </Link>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1548624149-f1af3de65b7d?auto=format&fit=crop&w=300&q=80" 
            alt="Lookbook"
            className="w-32 h-44 object-cover rounded shadow-soft border border-[#E8E1D5]" 
          />
        </div>
      </div>
    </div>
  );
};
