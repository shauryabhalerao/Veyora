import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export const LookbookPage = () => {
  const editorialLooks = [
    {
      title: "Monochrome Tailoring & Silk Sheaths",
      season: "Fall / Winter 2026",
      image: "https://images.unsplash.com/photo-1548624149-f1af3de65b7d?auto=format&fit=crop&w=1200&q=80",
      description: "Structured double-breasted blazers paired with high-waisted silk trousers."
    },
    {
      title: "Chanderi Handloom Heritage",
      season: "Festive Edit 2026",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
      description: "Hand-embroidered zardozi necklines with organza dupattas."
    },
    {
      title: "Resort Linen & French Flax Overshirts",
      season: "Resort 2026",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
      description: "Lightweight, breathable French flax linen overshirts for warm afternoons."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6D46]">Editorial Gazette</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1917]">The Veyora Lookbook</h1>
        <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
          An ongoing visual journal of quiet luxury, organic textiles, and timeless silhouettes.
        </p>
      </div>

      <div className="space-y-16">
        {editorialLooks.map((look, i) => (
          <div key={i} className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-elevated border border-[#E8E1D5]">
              <img src={look.image} alt={look.title} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D46]">{look.season}</span>
              <h2 className="font-serif text-3xl font-bold text-[#1C1917]">{look.title}</h2>
              <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">{look.description}</p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1C1917] hover:text-[#8C6D46] pt-2"
              >
                Shop This Edit →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
