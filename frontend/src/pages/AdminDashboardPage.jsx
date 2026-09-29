import React, { useState } from 'react';
import { initialProducts } from '../data/catalog';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, Package, DollarSign, Users, AlertTriangle, Plus, Trash2, Edit3, Download, FileText, CheckCircle2 } from 'lucide-react';

export const AdminDashboardPage = () => {
  const [productsList, setProductsList] = useState(initialProducts);
  const [activeTab, setActiveTab] = useState('analytics');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newProd, setNewProd] = useState({
    name: '',
    brand: 'Veyora Atelier',
    gender: 'Women',
    category: 'Dresses',
    price: 2999,
    originalPrice: 3999,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
    fabric: 'Silk Blend',
    fit: 'Regular'
  });

  const { formatPrice } = useCurrency();
  const { addToast } = useToast();

  const handleAddProduct = (e) => {
    e.preventDefault();
    const created = {
      ...newProd,
      id: `p-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      colors: [{ name: 'Default', hex: '#000000' }],
      sizes: ['S', 'M', 'L'],
      tags: [newProd.category.toLowerCase()]
    };

    setProductsList([created, ...productsList]);
    addToast(`Product ${created.name} added to catalog!`, 'success');
    setShowAddModal(false);
  };

  const handleDeleteProduct = (id) => {
    setProductsList(productsList.filter(p => p.id !== id));
    addToast('Product removed from catalog', 'info');
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Name,Gender,Category,Price,Rating\n"
      + productsList.map(p => `"${p.id}","${p.name}","${p.gender}","${p.category}",${p.price},${p.rating}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "veyora_products_report.csv");
    document.body.appendChild(link);
    link.click();
    addToast('Catalog CSV exported successfully!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#E8E1D5] pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D46] flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" /> Executive Suite
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">Veyora Admin Dashboard</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-white border border-[#E8E1D5] rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:border-[#1C1917]"
          >
            <Download className="w-4 h-4" /> Export CSV Report
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#1C1917] text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#8C6D46]"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E8E1D5] shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-[#78716C]">Total Revenue</span>
            <div className="font-serif text-2xl font-bold text-[#1C1917] mt-1">{formatPrice(1284900)}</div>
            <span className="text-[10px] text-emerald-700 font-bold">+18.4% from last month</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-[#8C6D46] flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E8E1D5] shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-[#78716C]">Total Orders</span>
            <div className="font-serif text-2xl font-bold text-[#1C1917] mt-1">428</div>
            <span className="text-[10px] text-emerald-700 font-bold">+12 new today</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E8E1D5] shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-[#78716C]">Active Customers</span>
            <div className="font-serif text-2xl font-bold text-[#1C1917] mt-1">1,890</div>
            <span className="text-[10px] text-emerald-700 font-bold">94% Retention Rate</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-800 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E8E1D5] shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-[#78716C]">Low Stock Alert</span>
            <div className="font-serif text-2xl font-bold text-rose-700 mt-1">2 Items</div>
            <span className="text-[10px] text-rose-700 font-bold">Requires re-order</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E8E1D5]">
        {['analytics', 'products', 'orders'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === tab ? 'border-[#1C1917] text-[#1C1917]' : 'border-transparent text-[#78716C]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products Table */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl border border-[#E8E1D5] overflow-hidden shadow-soft">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF7F2] text-[#1C1917] font-bold border-b border-[#E8E1D5] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Gender / Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E1D5]">
              {productsList.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#F5F0E6]/40 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={prod.image} alt={prod.name} className="w-10 h-12 object-cover rounded" />
                    <div>
                      <span className="font-bold text-[#1C1917] block">{prod.name}</span>
                      <span className="text-[10px] text-gray-400">ID: {prod.id}</span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-[#78716C]">{prod.gender} · {prod.category}</td>
                  <td className="p-4 font-bold text-[#1C1917]">{formatPrice(prod.price)}</td>
                  <td className="p-4"><span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded">-{prod.discount}%</span></td>
                  <td className="p-4 font-bold">{prod.rating} ★</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDeleteProduct(prod.id)} className="p-1.5 text-rose-700 hover:bg-rose-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] p-8 rounded-2xl max-w-md w-full border border-[#E8E1D5] space-y-4">
            <h3 className="font-serif text-2xl font-bold">Add New Fashion Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block">Product Name</label>
                <input type="text" required value={newProd.name} onChange={(e) => setNewProd({...newProd, name: e.target.value})} className="w-full p-2 bg-white border rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block">Gender</label>
                  <select value={newProd.gender} onChange={(e) => setNewProd({...newProd, gender: e.target.value})} className="w-full p-2 bg-white border rounded">
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block">Price (₹)</label>
                  <input type="number" required value={newProd.price} onChange={(e) => setNewProd({...newProd, price: Number(e.target.value)})} className="w-full p-2 bg-white border rounded" />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#1C1917] text-white rounded font-bold">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
