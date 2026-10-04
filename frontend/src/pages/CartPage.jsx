import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { initialProducts } from '../data/catalog';
import { ProductCard } from '../components/ui/ProductCard';

export const CartPage = () => {
  const [promoInput, setPromoInput] = useState('');
  const {
    cartItems,
    savedForLater,
    updateQuantity,
    removeFromCart,
    saveForLaterItem,
    moveToCartFromSaved,
    applyCouponCode,
    removeCoupon,
    appliedCoupon,
    subtotal,
    discountAmount,
    estimatedTax,
    shippingFee,
    grandTotal,
    totalCount,
    freeShippingThreshold
  } = useCart();

  const { formatPrice } = useCurrency();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyCouponCode(promoInput);
    if (res.success) {
      addToast(res.message, 'success');
      setPromoInput('');
    } else {
      addToast(res.message, 'error');
    }
  };

  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  // You might also like recommendations
  const recommended = initialProducts.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-12">
      
      {/* Breadcrumb & Header */}
      <div className="border-b border-[#E8E1D5] pb-6">
        <div className="text-xs text-[#78716C] mb-2 flex items-center gap-1.5">
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span className="text-[#1C1917] font-semibold">Bag</span>
        </div>
        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1C1917]">Your Bag</h1>
          <span className="text-xs font-semibold text-[#78716C]">{totalCount} {totalCount === 1 ? 'item' : 'items'}</span>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="py-16 text-center space-y-4 max-w-md mx-auto">
          <h3 className="font-serif text-2xl font-bold text-[#1C1917]">Your Bag is empty</h3>
          <p className="text-xs text-[#78716C]">
            Explore our new arrivals and quiet luxury edits to discover statement pieces tailored for you.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-[#1C1917] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#8C6D46] transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Items Column matching screenshot layout */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Free Shipping Progress Bar */}
            <div className="bg-[#F9ECE6] p-4 rounded-lg border border-[#E8E1D5] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                <span>
                  {remainingForFreeShipping <= 0
                    ? '🎉 You unlocked FREE Express Shipping!'
                    : `Add ${formatPrice(remainingForFreeShipping)} more for FREE Express Shipping`}
                </span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#E8E1D5]">
                <div
                  className="bg-[#1C1917] h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Item Cards List matching image screenshot */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-white p-5 rounded-lg border border-[#E8E1D5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-soft"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-32 object-cover rounded bg-[#F5F0E6] shrink-0 border border-[#E8E1D5]"
                    />
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg font-bold text-[#1C1917]">{item.name}</h3>
                      <p className="text-xs text-[#78716C]">
                        Color: {item.selectedColor} · Size: {item.selectedSize}
                      </p>
                      <div className="flex items-center gap-4 pt-2">
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-xs text-[#78716C] hover:text-rose-700 underline transition-colors"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => saveForLaterItem(item.cartItemId)}
                          className="text-xs text-[#78716C] hover:text-[#1C1917] underline transition-colors"
                        >
                          Save for later
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Control & Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-[#E8E1D5]">
                    {/* - 1 + Pill Control matching image */}
                    <div className="flex items-center border border-[#E8E1D5] bg-[#F5F0E6] rounded px-1.5 py-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          updateQuantity(item.cartItemId || item.id, -1);
                        }}
                        className="w-7 h-7 flex items-center justify-center text-[#1C1917] hover:text-[#8C6D46] hover:bg-white rounded text-sm font-bold transition-all cursor-pointer select-none"
                        aria-label="Deduct quantity"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold text-[#1C1917] min-w-[24px] text-center select-none">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          updateQuantity(item.cartItemId || item.id, 1);
                        }}
                        className="w-7 h-7 flex items-center justify-center text-[#1C1917] hover:text-[#8C6D46] hover:bg-white rounded text-sm font-bold transition-all cursor-pointer select-none"
                        aria-label="Add quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="font-serif text-lg font-bold text-[#1C1917] min-w-[80px] text-right">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping Link */}
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1C1917] hover:text-[#8C6D46] transition-colors"
              >
                ← Continue shopping
              </Link>
            </div>

            {/* Saved For Later Section */}
            {savedForLater.length > 0 && (
              <div className="pt-8 border-t border-[#E8E1D5] space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#1C1917]">Saved for later ({savedForLater.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedForLater.map((saved) => (
                    <div key={saved.cartItemId} className="p-3 bg-white rounded border border-[#E8E1D5] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={saved.image} alt={saved.name} className="w-12 h-16 object-cover rounded" />
                        <div>
                          <h4 className="font-serif font-bold text-sm text-[#1C1917]">{saved.name}</h4>
                          <span className="text-xs text-[#78716C]">{formatPrice(saved.price)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => moveToCartFromSaved(saved)}
                        className="px-3 py-1.5 bg-[#1C1917] text-white text-[11px] font-bold rounded hover:bg-[#8C6D46] transition-colors"
                      >
                        Move to Bag
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Order Summary Sidebar matching image reference */}
          <div className="bg-[#F7F3EB] p-6 md:p-8 rounded-xl border border-[#E8E1D5] space-y-6 sticky top-24">
            
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#78716C] block border-b border-[#E8E1D5] pb-3">
              ORDER SUMMARY
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-[#1C1917]">
                <span>Subtotal</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-rose-700 font-semibold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[#78716C]">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
              </div>

              <div className="flex items-center justify-between text-[#78716C]">
                <span>Estimated tax (12% GST)</span>
                <span>{formatPrice(estimatedTax)}</span>
              </div>

              <div className="pt-3 border-t border-[#E8E1D5] flex items-center justify-between text-base font-bold text-[#1C1917]">
                <span className="font-serif text-lg">Total</span>
                <span className="font-serif text-xl">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Promo code form matching image reference */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Promo code"
                className="bg-white border border-[#E8E1D5] px-3 py-2 rounded text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917] w-full"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#E8E1D5] hover:bg-[#1C1917] hover:text-white text-[#1C1917] text-xs font-bold uppercase tracking-wider rounded transition-colors"
              >
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs text-rose-800 bg-rose-50 p-2 rounded border border-rose-200">
                <span>Coupon {appliedCoupon.code} Active</span>
                <button onClick={removeCoupon} className="font-bold hover:underline">Remove</button>
              </div>
            )}

            {/* Bold Proceed To Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-[#1C1917] text-[#FAF7F2] text-xs font-bold uppercase tracking-widest rounded hover:bg-[#8C6D46] transition-colors shadow-soft"
            >
              PROCEED TO CHECKOUT
            </button>

            {/* Trust Badges matching image reference */}
            <div className="space-y-2 pt-2 border-t border-[#E8E1D5] text-[11px] text-[#78716C]">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-[#1C1917]" />
                <span>Free returns within 30 days</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1C1917]" />
                <span>Secure checkout, encrypted end-to-end</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* You Might Also Like Section matching bottom of reference screenshot */}
      <section className="pt-12 border-t border-[#E8E1D5] space-y-6">
        <div className="border-b border-[#E8E1D5] pb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716C] block">
            COMPLETE THE LOOK
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#1C1917]">You might also like</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommended.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

    </div>
  );
};
