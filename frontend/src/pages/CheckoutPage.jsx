import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, Lock, CreditCard, Gift, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, discountAmount, estimatedTax, shippingFee, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const { addToast } = useToast();

  const [address, setAddress] = useState({
    fullName: user?.name || 'Eleanor Vance',
    email: user?.email || 'eleanor@veyora.com',
    phone: user?.phone || '+91 98765 43210',
    street: '42 Marine Drive, Apt 7B',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400020'
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const finalShippingCost = shippingMethod === 'express' ? shippingFee + 99 : shippingFee;
  const giftWrapCost = isGiftWrap ? 50 : 0;
  const totalPayable = grandTotal + (shippingMethod === 'express' ? 99 : 0) + giftWrapCost;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const orderData = {
      orderId: `VEY-${Math.floor(100000 + Math.random() * 900000)}`,
      items: cartItems,
      shippingAddress: address,
      paymentMethod,
      totalAmount: totalPayable,
      giftWrap: isGiftWrap,
      giftNote,
      createdAt: new Date().toISOString()
    };

    try {
      // Post to backend server API
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      const data = await res.json();
      console.log('Order created response:', data);
    } catch (err) {
      console.warn('Backend server response fallback:', err);
    }

    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      addToast('Order successfully placed!', 'success');
      navigate('/order-confirmation', { state: { order: orderData } });
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      <div className="border-b border-[#E8E1D5] pb-4">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1C1917]">Secure Checkout</h1>
        <p className="text-xs text-[#78716C] mt-1">256-bit SSL Encrypted Transaction</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Left Address & Payment Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shipping Address */}
          <div className="bg-white p-6 md:p-8 rounded-xl border border-[#E8E1D5] shadow-soft space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1C1917] flex items-center justify-between">
              <span>1. Shipping Address</span>
              <span className="text-xs font-normal text-[#8C6D46]">Default Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-[#1C1917] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8E1D5] p-2.5 rounded text-[#1C1917]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1C1917] block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8E1D5] p-2.5 rounded text-[#1C1917]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-[#1C1917] block mb-1">Flat / House No / Street Address</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8E1D5] p-2.5 rounded text-[#1C1917]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1C1917] block mb-1">City</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8E1D5] p-2.5 rounded text-[#1C1917]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1C1917] block mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8E1D5] p-2.5 rounded text-[#1C1917]"
                />
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          <div className="bg-white p-6 md:p-8 rounded-xl border border-[#E8E1D5] shadow-soft space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">2. Delivery Speed</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`p-4 rounded-lg border cursor-pointer flex items-center justify-between ${shippingMethod === 'standard' ? 'border-[#1C1917] bg-[#F9ECE6]' : 'border-[#E8E1D5]'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="ship" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} />
                  <div>
                    <span className="font-bold text-xs text-[#1C1917] block">Standard Delivery</span>
                    <span className="text-[11px] text-[#78716C]">Delivered in 3-5 business days</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#1C1917]">{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
              </label>

              <label className={`p-4 rounded-lg border cursor-pointer flex items-center justify-between ${shippingMethod === 'express' ? 'border-[#1C1917] bg-[#F9ECE6]' : 'border-[#E8E1D5]'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="ship" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
                  <div>
                    <span className="font-bold text-xs text-[#1C1917] block">Express Delivery ✨</span>
                    <span className="text-[11px] text-[#78716C]">Delivered within 24-48 hours</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#1C1917]">{formatPrice(shippingFee + 99)}</span>
              </label>
            </div>
          </div>

          {/* Gift Wrap Option */}
          <div className="bg-[#F3EFE6] p-6 rounded-xl border border-[#E8E1D5] space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={isGiftWrap} onChange={(e) => setIsGiftWrap(e.target.checked)} className="w-4 h-4 accent-[#1C1917]" />
              <span className="font-serif font-bold text-base text-[#1C1917] flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#8C6D46]" /> Add Premium Veyora Gift Wrap (+₹50)
              </span>
            </label>
            {isGiftWrap && (
              <textarea
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="Write a personalized gift note card to be printed inside the box..."
                rows="2"
                className="w-full p-3 bg-white border border-[#E8E1D5] rounded text-xs text-[#1C1917]"
              />
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 md:p-8 rounded-xl border border-[#E8E1D5] shadow-soft space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">3. Payment Option</h3>
            
            <div className="space-y-3">
              {[
                { id: 'razorpay', label: 'Razorpay Instant (UPI / GPay / Cards / NetBanking)', icon: '💳' },
                { id: 'upi', label: 'UPI Direct (PhonePe / Google Pay / Paytm)', icon: '⚡' },
                { id: 'cod', label: 'Cash on Delivery (COD)', icon: '💵' }
              ].map((pm) => (
                <label key={pm.id} className={`p-4 rounded-lg border flex items-center justify-between cursor-pointer ${paymentMethod === pm.id ? 'border-[#1C1917] bg-[#FAF7F2]' : 'border-[#E8E1D5]'}`}>
                  <div className="flex items-center gap-3 text-xs font-bold text-[#1C1917]">
                    <input type="radio" name="pay" checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} />
                    <span>{pm.icon} {pm.label}</span>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Right Summary Sidebar */}
        <div className="bg-[#F7F3EB] p-6 md:p-8 rounded-xl border border-[#E8E1D5] space-y-6 sticky top-24">
          <h3 className="font-serif text-xl font-bold text-[#1C1917] border-b border-[#E8E1D5] pb-3">Order Summary</h3>

          <div className="space-y-3 text-xs divide-y divide-[#E8E1D5]">
            {cartItems.map((item) => (
              <div key={item.cartItemId} className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1C1917]">{item.quantity}x</span>
                  <span className="truncate max-w-[150px]">{item.name}</span>
                </div>
                <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E8E1D5] space-y-2 text-xs">
            <div className="flex justify-between text-[#78716C]"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-rose-700"><span>Discount</span><span>-{formatPrice(discountAmount)}</span></div>}
            <div className="flex justify-between text-[#78716C]"><span>Shipping</span><span>{finalShippingCost === 0 ? 'FREE' : formatPrice(finalShippingCost)}</span></div>
            {isGiftWrap && <div className="flex justify-between text-[#78716C]"><span>Gift Wrap</span><span>{formatPrice(50)}</span></div>}
            <div className="flex justify-between text-[#78716C]"><span>GST (12%)</span><span>{formatPrice(estimatedTax)}</span></div>

            <div className="pt-3 border-t border-[#E8E1D5] flex justify-between font-serif text-xl font-bold text-[#1C1917]">
              <span>Total Payable</span>
              <span>{formatPrice(totalPayable)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 bg-[#1C1917] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#8C6D46] transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Processing Order...' : `Pay & Complete Order (${formatPrice(totalPayable)})`}
          </button>
        </div>

      </form>
    </div>
  );
};
