import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Star, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../context/ToastContext';

export const QuickViewModal = ({ product, onClose }) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || { name: 'Default', hex: '#000000' });
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [activeImage, setActiveImage] = useState(product.image);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { addToast } = useToast();

  const isFavorited = isInWishlist(product.id);

  const handleSelectColor = (col, idx) => {
    setSelectedColor(col);
    const colorImg = col.image || product.images?.[idx] || product.image;
    if (colorImg) {
      setActiveImage(colorImg);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, 1, activeImage);
    addToast(`Added ${product.name} (${selectedColor.name} · Size: ${selectedSize}) to Bag`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#FAF7F2] w-full max-w-4xl rounded-2xl shadow-elevated border border-[#E8E1D5] overflow-hidden relative grid grid-cols-1 md:grid-cols-2 max-h-[90vh]">
        
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md text-[#1C1917] flex items-center justify-center hover:bg-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Column */}
        <div className="p-6 bg-[#F5F0E6] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8E1D5]">
          <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-white border border-[#E8E1D5]">
            <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Thumb"
                onClick={() => setActiveImage(img)}
                className={`w-14 h-18 object-cover rounded cursor-pointer border ${
                  activeImage === img ? 'border-[#1C1917] ring-1 ring-[#1C1917]' : 'border-[#E8E1D5]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Info Column */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#78716C] mb-1">
              <span className="uppercase font-bold tracking-widest text-[#8C6D46]">{product.gender} · {product.category}</span>
              <div className="flex items-center gap-1 font-semibold text-[#1C1917]">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span>({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1C1917]">{product.name}</h2>
            <p className="text-xs text-[#78716C] mt-2 line-clamp-3">{product.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 my-4">
              <span className="font-serif text-2xl font-bold text-[#1C1917]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-[#78716C] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="px-2 py-0.5 bg-[#F9ECE6] text-[#1C1917] text-xs font-bold rounded border border-[#E8E1D5]">
                  Save {product.discount}%
                </span>
              )}
            </div>

            {/* Color Selector */}
            <div className="space-y-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                Color: <span className="font-medium text-[#78716C]">{selectedColor.name}</span>
              </span>
              <div className="flex gap-2">
                {product.colors?.map((col, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectColor(col, idx)}
                    className={`w-6 h-6 rounded-full border border-black/20 ${
                      selectedColor.name === col.name ? 'ring-2 ring-offset-2 ring-[#1C1917]' : ''
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                <span>Select Size</span>
                <span className="text-[#8C6D46] font-normal cursor-pointer hover:underline">Size Chart</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-1.5 rounded text-xs font-bold border transition-all ${
                      selectedSize === size
                        ? 'bg-[#1C1917] text-white border-[#1C1917]'
                        : 'bg-white text-[#1C1917] border-[#E8E1D5] hover:border-[#1C1917]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Buttons & Guarantees */}
          <div className="space-y-3 pt-4 border-t border-[#E8E1D5]">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-[#1C1917] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#8C6D46] transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </button>
              
              <button
                onClick={() => {
                  toggleWishlist(product.id);
                  addToast(isFavorited ? 'Removed from Wishlist' : 'Saved to Wishlist', 'info');
                }}
                className={`p-3 rounded border border-[#E8E1D5] ${isFavorited ? 'bg-rose-900 text-white' : 'bg-white text-[#1C1917]'}`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#78716C] pt-2">
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Express 2-3 Day Delivery</span>
              <span className="flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> 7-Day Easy Returns</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
