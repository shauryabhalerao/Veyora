import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { initialProducts } from '../data/catalog';
import { ProductCard } from '../components/ui/ProductCard';
import { Link } from 'react-router-dom';

export const WishlistPage = () => {
  const { wishlist } = useWishlist();
  const wishlistedProducts = initialProducts.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      <div className="border-b border-[#E8E1D5] pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#1C1917]">My Saved Wishlist</h1>
        <p className="text-xs text-[#78716C] mt-1">{wishlistedProducts.length} items saved</p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="py-16 text-center space-y-4 max-w-md mx-auto">
          <h3 className="font-serif text-2xl font-bold text-[#1C1917]">Your Wishlist is empty</h3>
          <p className="text-xs text-[#78716C]">Tap the heart icon on any product to save your favorite styles for later.</p>
          <Link to="/shop" className="inline-block px-8 py-3 bg-[#1C1917] text-white text-xs font-bold uppercase tracking-widest rounded">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
