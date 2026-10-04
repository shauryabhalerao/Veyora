import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { apiClient } from '../utils/apiClient';
import { User, Package, MapPin, Award, RotateCcw, Sparkles, LogOut, ShieldCheck } from 'lucide-react';

export const UserAccountPage = () => {
  const { user, token, logout, isAdmin } = useAuth();
  const { formatPrice } = useCurrency();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        setLoadingOrders(true);
        const data = await apiClient('/orders', { method: 'GET' });
        if (data && data.success && Array.isArray(data.data)) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleLogout = () => {
    logout();
    addToast('You have logged out successfully.', 'info');
    navigate('/login');
  };

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      addToast('Referral Code copied to clipboard!', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      
      {/* Account Profile Header */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E8E1D5] shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#1C1917] text-white flex items-center justify-center font-serif text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#1C1917]">{user?.name}</h1>
              {isAdmin && (
                <span className="px-2 py-0.5 bg-[#1C1917] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#8C6D46]" /> Admin
                </span>
              )}
            </div>
            <p className="text-xs text-[#78716C]">
              {user?.email} {user?.phone ? `· ${user.phone}` : ''}
            </p>
          </div>
        </div>

        {/* Loyalty & Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-6 bg-[#F9ECE6] p-4 rounded-xl border border-[#E8E1D5]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D46] block">Veyora Tier</span>
              <span className="font-serif font-bold text-lg text-[#1C1917]">
                {user?.role === 'admin' ? 'Administrator' : 'Gold VIP Member'}
              </span>
            </div>
            <div className="text-right border-l border-[#E8E1D5] pl-6">
              <span className="text-[10px] text-[#78716C] block">Points Balance</span>
              <span className="font-serif font-bold text-lg text-[#8C6D46]">{user?.loyaltyPoints || 0} Pts</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-3 bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-[#E8E1D5] overflow-x-auto">
        {[
          { id: 'orders', label: 'Order History & Tracking', icon: Package },
          { id: 'size', label: 'Saved Size Profile', icon: Sparkles },
          { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
          { id: 'loyalty', label: 'Loyalty & Referral', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#1C1917] text-[#1C1917]'
                  : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {loadingOrders ? (
            <div className="bg-white p-8 rounded-xl border border-[#E8E1D5] text-center text-xs text-[#78716C]">
              Loading your order history...
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-[#E8E1D5] text-center space-y-3">
              <Package className="w-10 h-10 text-[#78716C] mx-auto opacity-50" />
              <h3 className="font-serif font-bold text-lg text-[#1C1917]">No Orders Placed Yet</h3>
              <p className="text-xs text-[#78716C]">
                Explore our fine collections and your order history will appear here.
              </p>
            </div>
          ) : (
            orders.map((ord) => (
              <div key={ord.id || ord.orderNumber} className="bg-white p-6 rounded-xl border border-[#E8E1D5] shadow-soft space-y-4">
                <div className="flex flex-wrap items-center justify-between text-xs border-b border-[#E8E1D5] pb-3 gap-2">
                  <div>
                    <span className="font-bold text-[#1C1917] block">Order #{ord.orderNumber || ord.id}</span>
                    <span className="text-[#78716C]">
                      {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase ${ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {ord.status || 'Processing'}
                    </span>
                    <span className="font-serif font-bold text-sm text-[#1C1917]">
                      {formatPrice(ord.totalAmount || ord.total || 0)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {Array.isArray(ord.items) && ord.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded" />
                        )}
                        <div>
                          <h4 className="font-serif font-bold text-sm text-[#1C1917]">{item.name}</h4>
                          <span className="text-[#78716C]">Size: {item.size || 'Standard'}</span>
                        </div>
                      </div>
                      <span className="font-bold">{formatPrice(item.price || 0)}</span>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="pt-3 border-t border-[#E8E1D5] flex gap-3 text-xs">
                  <button className="px-3 py-1.5 bg-[#FAF7F2] border border-[#E8E1D5] font-bold rounded hover:border-[#1C1917]">
                    Track Live Delivery
                  </button>
                  <button className="px-3 py-1.5 bg-[#FAF7F2] border border-[#E8E1D5] font-bold rounded hover:border-[#1C1917] flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5" /> Easy Return / Exchange
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Size Profile Tab */}
      {activeTab === 'size' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E8E1D5] shadow-soft space-y-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1C1917]">Saved Size Profile</h3>
            <p className="text-xs text-[#78716C]">Save your measurements to get automated AI size recommendations on every product page.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] space-y-2">
              <h4 className="font-serif font-bold text-base">Women Profile</h4>
              <div>Top Size: <strong>M</strong></div>
              <div>Trouser / Jean Size: <strong>28</strong></div>
              <div>Bust: <strong>36"</strong> · Waist: <strong>28"</strong> · Hip: <strong>38"</strong></div>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] space-y-2">
              <h4 className="font-serif font-bold text-base">Men Profile</h4>
              <div>Shirt Size: <strong>L</strong></div>
              <div>Trouser Size: <strong>32</strong></div>
              <div>Chest: <strong>40"</strong></div>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] space-y-2">
              <h4 className="font-serif font-bold text-base">Kids Profile</h4>
              <div>Age Group: <strong>6-7Y</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Addresses Tab */}
      {activeTab === 'addresses' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E8E1D5] shadow-soft space-y-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1C1917]">Saved Addresses</h3>
            <p className="text-xs text-[#78716C]">Manage your delivery addresses for seamless checkout.</p>
          </div>

          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] space-y-2 text-xs">
            <span className="px-2 py-0.5 bg-[#1C1917] text-white text-[10px] font-bold uppercase rounded">Default</span>
            <h4 className="font-serif font-bold text-sm">{user?.name}</h4>
            <p className="text-[#78716C]">Primary account address attached to checkout.</p>
          </div>
        </div>
      )}

      {/* Loyalty Tab */}
      {activeTab === 'loyalty' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E8E1D5] shadow-soft space-y-6">
          <div className="p-6 bg-[#F9ECE6] rounded-xl border border-[#E8E1D5] flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D46]">Referral Program</span>
              <h3 className="font-serif text-2xl font-bold text-[#1C1917]">Share Veyora & Earn ₹500</h3>
              <p className="text-xs text-[#78716C] mt-1">Give your friends 15% off their first order and get ₹500 store credit when they purchase.</p>
            </div>

            {user?.referralCode && (
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-[#E8E1D5]">
                <span className="font-mono font-bold text-sm text-[#1C1917]">{user.referralCode}</span>
                <button onClick={copyReferralCode} className="px-3 py-1 bg-[#1C1917] text-white text-xs font-bold rounded">
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
