import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Truck, ShieldCheck, RotateCcw, MapPin, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { initialProducts } from '../data/catalog';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ui/ProductCard';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = initialProducts.find(p => p.id === id) || initialProducts[0];

  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || { name: 'Default', hex: '#000000' });
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [activeImage, setActiveImage] = useState(product.image);
  const [pincode, setPincode] = useState('400020');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [showSizeChart, setShowSizeChart] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { addToast } = useToast();
  const { user } = useAuth();

  const isFavorited = isInWishlist(product.id);

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeResult(`Delivering to ${pincode} by ${new Date(Date.now() + 3*86400000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} · COD Available`);
    } else {
      addToast('Please enter a valid 6-digit Pincode', 'error');
    }
  };

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
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, 1, activeImage);
    navigate('/checkout');
  };

  const relatedProducts = initialProducts.filter(p => p.id !== product.id && p.gender === product.gender).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-12">
      
      {/* Breadcrumb */}
      <div className="text-xs text-[#78716C] flex items-center gap-1.5 border-b border-[#E8E1D5] pb-4">
        <Link to="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link to={`/shop?gender=${product.gender}`} className="hover:underline">{product.gender}</Link>
        <span>/</span>
        <span className="text-[#1C1917] font-semibold">{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column - Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white border border-[#E8E1D5] shadow-soft relative group">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-[#1C1917] text-white text-xs font-bold rounded">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Thumbnail"
                onClick={() => setActiveImage(img)}
                className={`w-20 h-24 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                  activeImage === img ? 'border-[#1C1917] ring-1 ring-[#1C1917]' : 'border-[#E8E1D5] hover:border-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Product Meta & Actions */}
        <div className="space-y-6 bg-white p-8 rounded-2xl border border-[#E8E1D5] shadow-soft">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D46]">{product.brand} · {product.gender}</span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1C1917] mt-1">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex items-center gap-1 font-bold text-[#1C1917]">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-[#78716C] underline cursor-pointer">{product.reviewsCount} Reviews</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-4 border-y border-[#E8E1D5] py-4">
            <span className="font-serif text-3xl font-bold text-[#1C1917]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-base text-[#78716C] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-xs text-[#78716C] font-semibold">(Inclusive of all taxes)</span>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
              Color: <span className="font-normal text-[#78716C]">{selectedColor.name}</span>
            </span>
            <div className="flex gap-2.5">
              {product.colors?.map((col, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectColor(col, idx)}
                  className={`w-7 h-7 rounded-full border border-black/20 ${
                    selectedColor.name === col.name ? 'ring-2 ring-offset-2 ring-[#1C1917]' : ''
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selection with AI Size Recommendation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1C1917]">
              <span>Select Size</span>
              <button onClick={() => setShowSizeChart(true)} className="text-[#8C6D46] hover:underline flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Size Chart & AI Finder
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((size, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded text-xs font-bold border transition-all ${
                    selectedSize === size
                      ? 'bg-[#1C1917] text-white border-[#1C1917]'
                      : 'bg-white text-[#1C1917] border-[#E8E1D5] hover:border-[#1C1917]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {user?.sizeProfile && (
              <div className="p-2.5 bg-[#F9ECE6] rounded text-[11px] text-[#1C1917] border border-[#E8E1D5] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8C6D46]" />
                <span>AI Recommendation for <strong>{user.name.split(' ')[0]}</strong>: Size <strong>{selectedSize}</strong> matches your saved profile.</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-[#1C1917] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#8C6D46] transition-colors flex items-center justify-center gap-2 shadow-soft"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </button>
              
              <button
                onClick={() => {
                  toggleWishlist(product.id);
                  addToast(isFavorited ? 'Removed from Wishlist' : 'Saved to Wishlist', 'info');
                }}
                className={`p-4 rounded border border-[#E8E1D5] ${isFavorited ? 'bg-rose-900 text-white' : 'bg-white text-[#1C1917]'}`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 bg-[#8C6D46] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#1C1917] transition-colors"
            >
              Buy Now with 1-Click Checkout
            </button>
          </div>

          {/* Pincode Checker */}
          <div className="pt-4 border-t border-[#E8E1D5] space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1C1917] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#8C6D46]" /> Check Delivery & COD Availability
            </span>
            <form onSubmit={handlePincodeCheck} className="flex max-w-sm gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                placeholder="Enter 6-digit Pincode"
                className="bg-[#FAF7F2] border border-[#E8E1D5] px-3 py-2 rounded text-xs text-[#1C1917] focus:outline-none w-full"
              />
              <button type="submit" className="px-4 py-2 bg-[#1C1917] text-white text-xs font-bold rounded hover:bg-[#8C6D46]">
                Check
              </button>
            </form>
            {pincodeResult && (
              <p className="text-xs text-emerald-800 font-medium bg-emerald-50 p-2 rounded border border-emerald-200">
                ✓ {pincodeResult}
              </p>
            )}
          </div>

          {/* Specs List */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E8E1D5] text-xs text-[#78716C]">
            <div><strong className="text-[#1C1917]">Fabric:</strong> {product.fabric}</div>
            <div><strong className="text-[#1C1917]">Fit:</strong> {product.fit}</div>
            <div><strong className="text-[#1C1917]">Care:</strong> {product.care}</div>
            <div><strong className="text-[#1C1917]">Occasion:</strong> {product.occasion}</div>
          </div>

        </div>

      </div>

      {/* Reviews & Fit Feedback Bar Section */}
      <section className="bg-white p-8 rounded-2xl border border-[#E8E1D5] space-y-6">
        <div className="border-b border-[#E8E1D5] pb-4 flex items-center justify-between">
          <h3 className="font-serif text-2xl font-bold text-[#1C1917]">Customer Reviews & Fit Feedback</h3>
          <button className="px-4 py-2 bg-[#1C1917] text-white text-xs font-bold uppercase rounded hover:bg-[#8C6D46]">
            Write a Review
          </button>
        </div>

        {/* Fit Feedback Indicator */}
        <div className="p-4 bg-[#F9ECE6] rounded-xl border border-[#E8E1D5] max-w-md space-y-2">
          <div className="flex justify-between text-xs font-bold text-[#1C1917]">
            <span>Fit Feedback</span>
            <span>89% say True to Size</span>
          </div>
          <div className="flex text-[10px] text-[#78716C] justify-between font-semibold">
            <span>Runs Small (5%)</span>
            <span className="text-[#1C1917] font-bold">True to Size (89%)</span>
            <span>Runs Large (6%)</span>
          </div>
          <div className="w-full bg-white h-2 rounded-full overflow-hidden flex border border-[#E8E1D5]">
            <div className="w-[5%] bg-amber-400"></div>
            <div className="w-[89%] bg-[#1C1917]"></div>
            <div className="w-[6%] bg-amber-400"></div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="space-y-6 pt-6">
        <h2 className="font-serif text-2xl font-bold text-[#1C1917] border-b border-[#E8E1D5] pb-3">Related Styles You Might Love</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] p-8 rounded-2xl max-w-xl w-full border border-[#E8E1D5] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3">
              <h3 className="font-serif text-xl font-bold">Standard Veyora Size Chart (Inches)</h3>
              <button onClick={() => setShowSizeChart(false)} className="text-gray-500 hover:text-black">✕</button>
            </div>

            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#1C1917] text-white">
                  <th className="p-2.5">Size</th>
                  <th className="p-2.5">Bust/Chest</th>
                  <th className="p-2.5">Waist</th>
                  <th className="p-2.5">Hip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E1D5] bg-white">
                <tr><td className="p-2.5 font-bold">XS</td><td className="p-2.5">32 - 34</td><td className="p-2.5">26 - 27</td><td className="p-2.5">35 - 36</td></tr>
                <tr><td className="p-2.5 font-bold">S</td><td className="p-2.5">34 - 36</td><td className="p-2.5">28 - 29</td><td className="p-2.5">37 - 38</td></tr>
                <tr><td className="p-2.5 font-bold">M</td><td className="p-2.5">36 - 38</td><td className="p-2.5">30 - 31</td><td className="p-2.5">39 - 40</td></tr>
                <tr><td className="p-2.5 font-bold">L</td><td className="p-2.5">38 - 40</td><td className="p-2.5">32 - 34</td><td className="p-2.5">41 - 43</td></tr>
                <tr><td className="p-2.5 font-bold">XL</td><td className="p-2.5">40 - 42</td><td className="p-2.5">35 - 37</td><td className="p-2.5">44 - 46</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
