import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const OrderConfirmationPage = () => {
  const location = useLocation();
  const order = location.state?.order || {
    orderId: 'VEY-894120',
    totalAmount: 7998,
    shippingAddress: { fullName: 'Eleanor Vance', street: '42 Marine Drive, Apt 7B', city: 'Mumbai', pincode: '400020' },
    createdAt: new Date().toISOString()
  };

  const { formatPrice } = useCurrency();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8 animate-slide-up">
      <div className="w-16 h-16 rounded-full bg-[#1C1917] text-[#C5A059] flex items-center justify-center mx-auto shadow-elevated">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D46]">Order Confirmed</span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1C1917]">Thank you for your order!</h1>
        <p className="text-xs text-[#78716C]">
          We have received your order <strong>#{order.orderId}</strong> and a confirmation email has been sent to your inbox.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-[#E8E1D5] shadow-soft text-left space-y-4 text-xs">
        <div className="flex justify-between border-b border-[#E8E1D5] pb-3">
          <div>
            <span className="text-gray-400 block">Order Number</span>
            <span className="font-bold text-sm text-[#1C1917]">{order.orderId}</span>
          </div>
          <div>
            <span className="text-gray-400 block">Total Paid</span>
            <span className="font-serif font-bold text-base text-[#1C1917]">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-bold text-[#1C1917] block mb-1">Delivering To:</span>
            <p className="text-[#78716C] leading-relaxed">
              {order.shippingAddress?.fullName}<br />
              {order.shippingAddress?.street}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.pincode}
            </p>
          </div>
          <div>
            <span className="font-bold text-[#1C1917] block mb-1">Estimated Delivery:</span>
            <p className="text-[#78716C]">
              {new Date(Date.now() + 3*86400000).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <Link
          to="/account"
          className="px-6 py-3 bg-[#1C1917] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#8C6D46] transition-colors"
        >
          Track Order History
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3 bg-[#FAF7F2] text-[#1C1917] border border-[#E8E1D5] text-xs font-bold uppercase tracking-widest rounded hover:border-[#1C1917] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};
