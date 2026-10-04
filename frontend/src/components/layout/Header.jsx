import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Sparkles, Menu, X, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { MegaMenu } from './MegaMenu';
import { QuickSearch } from './QuickSearch';

export const Header = () => {
  const [activeMegaCategory, setActiveMegaCategory] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { totalCount } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E1D5] transition-all">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between relative">
        
        {/* Mobile Menu Toggle & Navigation Links */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden p-1 text-[#1C1917]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-widest text-[#1C1917]">
            <Link to="/" className="hover:text-[#8C6D46] transition-colors py-2">Home</Link>
            
            <div 
              onMouseEnter={() => setActiveMegaCategory('Women')}
              className="py-2 cursor-pointer hover:text-[#8C6D46] transition-colors flex items-center gap-1"
            >
              <Link to="/shop?gender=Women">Women</Link>
            </div>

            <div 
              onMouseEnter={() => setActiveMegaCategory('Men')}
              className="py-2 cursor-pointer hover:text-[#8C6D46] transition-colors flex items-center gap-1"
            >
              <Link to="/shop?gender=Men">Men</Link>
            </div>

            <div 
              onMouseEnter={() => setActiveMegaCategory('Kids')}
              className="py-2 cursor-pointer hover:text-[#8C6D46] transition-colors flex items-center gap-1"
            >
              <Link to="/shop?gender=Kids">Kids</Link>
            </div>

            <Link to="/lookbook" className="hover:text-[#8C6D46] transition-colors py-2">Lookbook</Link>
            
            {/* AI Features Button */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-stylist'))}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#F9ECE6] text-[#1C1917] rounded-full border border-[#E8E1D5] hover:bg-[#1C1917] hover:text-white transition-all text-[11px] font-bold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8C6D46]" /> AI Stylist
            </button>
          </nav>
        </div>

        {/* Center Brand Logo */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="font-serif tracking-[0.25em] text-2xl md:text-3xl font-bold uppercase text-[#1C1917]">
              VEYORA
            </span>
          </Link>
        </div>

        {/* Right Search, Wishlist, Cart & Profile */}
        <div className="flex items-center gap-4 md:gap-5">
          {/* Quick Search Button */}
          <div className="hidden sm:flex items-center">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E8E1D5] rounded-full text-xs text-[#78716C] hover:border-[#1C1917] transition-all"
            >
              <Search className="w-3.5 h-3.5 text-[#8C6D46]" />
              <span>Search...</span>
            </button>
          </div>

          <button 
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden p-1 text-[#1C1917]"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative p-1 text-[#1C1917] hover:text-[#8C6D46] transition-colors">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8C6D46] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Shopping Bag / Cart */}
          <Link to="/cart" className="relative p-1 text-[#1C1917] hover:text-[#8C6D46] transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#1C1917] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCount < 10 ? `0${totalCount}` : totalCount}
              </span>
            )}
          </Link>

          {/* User Account / Admin Badge */}
          <Link to={user ? "/account" : "/login"} className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1917] hover:text-[#8C6D46] transition-colors">
            <User className="w-5 h-5" />
            <span className="hidden lg:inline">{user ? user.name.split(' ')[0] : 'Login'}</span>
          </Link>

          {isAdmin && (
            <Link 
              to="/admin" 
              className="hidden xl:flex items-center gap-1 px-2.5 py-1 bg-[#1C1917] text-[#FAF7F2] text-[10px] font-bold tracking-wider uppercase rounded hover:bg-[#8C6D46] transition-colors"
            >
              <ShieldCheck className="w-3 h-3" /> Admin
            </Link>
          )}
        </div>
      </div>

      {/* Render Mega Menu */}
      <MegaMenu category={activeMegaCategory} onClose={() => setActiveMegaCategory(null)} />

      {/* Render Quick Search Popup */}
      <QuickSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#E8E1D5] px-6 py-6 space-y-4 text-sm font-semibold uppercase tracking-wider">
          <Link to="/shop?gender=Women" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">Women Collection</Link>
          <Link to="/shop?gender=Men" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">Men Collection</Link>
          <Link to="/shop?gender=Kids" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">Kids Collection</Link>
          <Link to="/lookbook" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">Lookbook</Link>
          <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">My Account & Orders</Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-amber-700">Admin Dashboard</Link>
          )}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              window.dispatchEvent(new CustomEvent('open-ai-stylist'));
            }}
            className="w-full text-center py-2.5 bg-[#1C1917] text-white rounded text-xs font-bold uppercase tracking-widest mt-2"
          >
            Open AI Personal Stylist ✨
          </button>
        </div>
      )}
    </header>
  );
};
