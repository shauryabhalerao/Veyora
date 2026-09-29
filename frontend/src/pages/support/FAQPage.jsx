import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQPage = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    { q: "How long does shipping take?", a: "Standard express delivery takes 2-4 business days across India. Same-day dispatch is available for orders placed before 2 PM." },
    { q: "What is your return & exchange policy?", a: "We offer a 7-day hassle-free doorstep pickup return and size exchange. Items must be unworn with original tags." },
    { q: "How does the AI Personal Stylist work?", a: "Our AI Stylist queries our live product catalog to curate complete outfits tailored to your occasion, budget, and style preference." },
    { q: "Is Cash on Delivery (COD) available?", a: "Yes! COD is available for all pin codes across India with zero extra fees for orders above ₹3000." }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D46]">Assistance</span>
        <h1 className="font-serif text-4xl font-bold text-[#1C1917]">Frequently Asked Questions</h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-[#E8E1D5] overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
              className="w-full p-4 text-left font-serif font-bold text-base text-[#1C1917] flex justify-between items-center"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === idx && (
              <div className="p-4 pt-0 text-xs text-[#78716C] border-t border-[#FAF7F2] leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
