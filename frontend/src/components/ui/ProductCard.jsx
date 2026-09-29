import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../context/ToastContext';

export const ProductCard = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || { name: 'Default', hex: '#000000' });
  
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { addToast } = useToast();

  const isFavorited = isInWishlist(product.id);
  const colorIndex = product.colors?.findIndex(c => (typeof c === 'object' ? c.name : c) === selectedColor.name) ?? 0;
  const activeColorImage = selectedColor.image || (colorIndex > 0 && product.images?.[colorIndex]) || product.image;
  const secondImage = product.images?.[1] || activeColorImage;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedColor, product.sizes?.[0] || 'M', 1, activeColorImage);
    addToast(`Added ${product.name} (${selectedColor.name}) to your Bag`, 'success');
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    addToast(isFavorited ? 'Removed from Wishlist' : 'Saved to Wishlist', 'info');
  };

  return (
    <div 
      className="group relative bg-white rounded-lg border border-[#E8E1D5] overflow-hidden transition-all duration-300 hover:shadow-elevated flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F0E6] cursor-pointer">
        <Link to={`/product/${product.id}`}>
          <img
            src={isHovered ? secondImage : activeColorImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Discount / New Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.discount > 0 && (
            <span className="px-2.5 py-1 bg-[#1C1917] text-[#FAF7F2] text-[10px] font-bold tracking-wider uppercase rounded-sm">
              -{product.discount}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-1 bg-[#F9ECE6] text-[#1C1917] text-[10px] font-bold tracking-wider uppercase rounded-sm border border-[#E8E1D5]">
              New
            </span>
          )}
        </div>

        {/* Wishlist Floating Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFavorited 
              ? 'bg-rose-900 text-white shadow-soft' 
              : 'bg-white/80 backdrop-blur-md text-[#1C1917] hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Actions */}
        <div className="absolute bottom-3 inset-x-3 flex gap-2 transition-all duration-300 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onQuickView) onQuickView(product);
            }}
            className="flex-1 py-2 bg-white/90 backdrop-blur-md text-[#1C1917] text-xs font-bold uppercase tracking-wider rounded hover:bg-white transition-colors flex items-center justify-center gap-1 border border-[#E8E1D5]"
          >
            <Eye className="w-3.5 h-3.5 text-[#8C6D46]" /> Quick View
          </button>
          
          <button
            onClick={handleQuickAdd}
            className="p-2 bg-[#1C1917] text-white rounded hover:bg-[#8C6D46] transition-colors"
            title="Quick Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details Footer */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#78716C]">
            <span className="uppercase tracking-widest font-semibold text-[#8C6D46]">{product.brand || 'Veyora'}</span>
            <div className="flex items-center gap-1 font-medium text-[#1C1917]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-gray-400">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 className="font-serif text-base font-bold text-[#1C1917] mt-1 line-clamp-1 group-hover:text-[#8C6D46] transition-colors">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
        </div>

        {/* Color Swatches & Price */}
        <div className="pt-2 border-t border-[#E8E1D5] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {product.colors?.map((col, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedColor(col);
                }}
                className={`w-3.5 h-3.5 rounded-full border border-black/20 transition-transform ${
                  selectedColor.name === col.name ? 'scale-125 ring-2 ring-[#1C1917]' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
          </div>

          <div className="flex items-baseline gap-2">
            {product.originalPrice > product.price && (
              <span className="text-xs text-[#78716C] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="font-serif font-bold text-base text-[#1C1917]">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
