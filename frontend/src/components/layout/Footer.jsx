import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Lock, ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      addToast('Thank you for subscribing to Veyora Gazette! 15% discount code sent.', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1C1917] text-[#FAF7F2] pt-16 pb-12 border-t border-[#38332E]">
      {/* Brand Benefits Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 border-b border-[#38332E] grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex items-start gap-4">
          <Truck className="w-6 h-6 text-[#C5A059] shrink-0 mt-1" />
          <div>
            <h4 className="font-serif font-bold text-lg">Complimentary Express Shipping</h4>
            <p className="text-xs text-[#A8A095] mt-1">On all orders above ₹3000 across India.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <RotateCcw className="w-6 h-6 text-[#C5A059] shrink-0 mt-1" />
          <div>
            <h4 className="font-serif font-bold text-lg">Easy 7-Day Returns</h4>
            <p className="text-xs text-[#A8A095] mt-1">Hassle-free size exchange & instant refunds.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Lock className="w-6 h-6 text-[#C5A059] shrink-0 mt-1" />
          <div>
            <h4 className="font-serif font-bold text-lg">Encrypted Payments</h4>
            <p className="text-xs text-[#A8A095] mt-1">Razorpay SSL 256-bit secure checkout.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-[#C5A059] shrink-0 mt-1" />
          <div>
            <h4 className="font-serif font-bold text-lg">100% Authentic Quality</h4>
            <p className="text-xs text-[#A8A095] mt-1">Directly sourced organic linen & mulberry silk.</p>
          </div>
        </div>
      </div>

      {/* Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-10">
        
        {/* Brand Info */}
        <div className="md:col-span-2 space-y-4">
          <span className="font-serif tracking-[0.25em] text-3xl font-bold uppercase text-white block">
            VEYORA
          </span>
          <p className="text-xs text-[#A8A095] leading-relaxed max-w-sm">
            Veyora is a modern fashion atelier bringing quiet luxury, fine craft, and AI-assisted personal styling to women, men, and kids.
          </p>
          
          {/* Newsletter Form */}
          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] block mb-2">
              Subscribe for 15% off your first edit
            </span>
            <form onSubmit={handleNewsletter} className="flex max-w-sm">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address" 
                required
                className="bg-[#2A2623] border border-[#38332E] text-white px-3.5 py-2.5 rounded-l text-xs w-full focus:outline-none focus:border-[#C5A059]"
              />
              <button 
                type="submit" 
                className="bg-[#C5A059] hover:bg-[#A87C38] text-white px-4 py-2.5 rounded-r transition-colors flex items-center justify-center"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="font-serif font-bold text-sm tracking-wider uppercase text-white mb-4">Shop Categories</h5>
          <ul className="space-y-2 text-xs text-[#A8A095]">
            <li><Link to="/shop?gender=Women" className="hover:text-white transition-colors">Women's Collection</Link></li>
            <li><Link to="/shop?gender=Men" className="hover:text-white transition-colors">Men's Collection</Link></li>
            <li><Link to="/shop?gender=Kids" className="hover:text-white transition-colors">Kids & Infants</Link></li>
            <li><Link to="/shop?collection=festive" className="hover:text-white transition-colors">Festive Edit 2026</Link></li>
            <li><Link to="/shop?collection=bestsellers" className="hover:text-white transition-colors">Best Sellers</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h5 className="font-serif font-bold text-sm tracking-wider uppercase text-white mb-4">Customer Care</h5>
          <ul className="space-y-2 text-xs text-[#A8A095]">
            <li><Link to="/faq" className="hover:text-white transition-colors">FAQ & Assistance</Link></li>
            <li><Link to="/size-guide" className="hover:text-white transition-colors">Size & Measurement Guide</Link></li>
            <li><Link to="/return-policy" className="hover:text-white transition-colors">Returns & Exchange Policy</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="/account" className="hover:text-white transition-colors">Track Your Order</Link></li>
          </ul>
        </div>

        {/* Legal & Social */}
        <div>
          <h5 className="font-serif font-bold text-sm tracking-wider uppercase text-white mb-4">About & Legal</h5>
          <ul className="space-y-2 text-xs text-[#A8A095]">
            <li><Link to="/about" className="hover:text-white transition-colors">Our Story & Craft</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>

          <div className="flex items-center gap-4 mt-6">
            <a href="#instagram" className="w-8 h-8 rounded-full bg-[#2A2623] flex items-center justify-center text-[#A8A095] hover:text-white hover:bg-[#C5A059] transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#facebook" className="w-8 h-8 rounded-full bg-[#2A2623] flex items-center justify-center text-[#A8A095] hover:text-white hover:bg-[#C5A059] transition-all">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#twitter" className="w-8 h-8 rounded-full bg-[#2A2623] flex items-center justify-center text-[#A8A095] hover:text-white hover:bg-[#C5A059] transition-all">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-[#2A2623] flex flex-col md:flex-row items-center justify-between text-[11px] text-[#78716C]">
        <p>© 2026 VEYORA Atelier Ltd. All rights reserved.</p>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <span>Razorpay Verified</span>
          <span>•</span>
          <span>SSL 256-Bit Encrypted</span>
        </div>
      </div>
    </footer>
  );
};
