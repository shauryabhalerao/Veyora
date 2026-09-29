import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, SlidersHorizontal, X, Check } from 'lucide-react';
import { initialProducts, CATEGORIES_CONFIG } from '../data/catalog';
import { ProductCard } from '../components/ui/ProductCard';
import { QuickViewModal } from '../components/ui/QuickViewModal';
import { useCurrency } from '../context/CurrencyContext';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const genderParam = searchParams.get('gender') || 'All';
  const categoryParam = searchParams.get('category') || 'All';
  const collectionParam = searchParams.get('collection') || '';
  const searchParam = searchParams.get('search') || '';

  const [selectedGender, setSelectedGender] = useState(genderParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(6000);
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const { formatPrice } = useCurrency();

  // Filter products dynamically
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      if (selectedGender !== 'All' && p.gender !== selectedGender) return false;
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (p.price > maxPrice) return false;
      if (selectedSizes.length > 0 && !p.sizes.some(s => selectedSizes.includes(s))) return false;
      if (collectionParam === 'festive' && !p.isFestive) return false;
      if (collectionParam === 'new' && !p.isNewArrival) return false;
      if (collectionParam === 'bestsellers' && !p.isBestseller) return false;
      if (collectionParam === 'sale' && p.discount === 0) return false;
      if (searchParam && !p.name.toLowerCase().includes(searchParam.toLowerCase()) && !p.tags.some(t => t.toLowerCase().includes(searchParam.toLowerCase()))) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      if (sortBy === 'discount') return b.discount - a.discount;
      return b.rating - a.rating; // default popularity
    });
  }, [selectedGender, selectedCategory, maxPrice, selectedSizes, collectionParam, searchParam, sortBy]);

  const toggleSizeFilter = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setSelectedGender('All');
    setSelectedCategory('All');
    setSelectedSizes([]);
    setMaxPrice(6000);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      
      {/* Page Title Header */}
      <div className="border-b border-[#E8E1D5] pb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6D46]">
            Catalog Archive
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1C1917] mt-1">
            {selectedGender !== 'All' ? `${selectedGender}'s Collection` : 'All Products'}
            {collectionParam && ` · ${collectionParam.toUpperCase()}`}
          </h1>
          <p className="text-xs text-[#78716C] mt-1">Showing {filteredProducts.length} items</p>
        </div>

        {/* Sorting & Grid Toggle Controls */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="md:hidden px-4 py-2 bg-white border border-[#E8E1D5] rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-[#78716C] hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#E8E1D5] px-3 py-2 rounded text-xs text-[#1C1917] font-medium focus:outline-none focus:border-[#1C1917]"
            >
              <option value="popularity">Popularity & Rating</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>

          <div className="hidden sm:flex border border-[#E8E1D5] bg-white rounded p-1 gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#1C1917] text-white' : 'text-[#78716C]'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#1C1917] text-white' : 'text-[#78716C]'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid + Filter Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block space-y-6 bg-white p-6 rounded-xl border border-[#E8E1D5] shadow-soft">
          <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3">
            <h3 className="font-serif text-lg font-bold text-[#1C1917] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#8C6D46]" /> Filters
            </h3>
            <button onClick={clearAllFilters} className="text-xs text-rose-700 font-bold hover:underline">
              Reset
            </button>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1C1917] block">Department</span>
            <div className="flex flex-col gap-1.5 text-xs text-[#78716C]">
              {['All', 'Women', 'Men', 'Kids'].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`text-left py-1 px-2 rounded transition-colors ${
                    selectedGender === g ? 'bg-[#F9ECE6] text-[#1C1917] font-bold' : 'hover:text-[#1C1917]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2 border-t border-[#E8E1D5] pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1C1917] block">Category</span>
            <div className="flex flex-col gap-1 text-xs text-[#78716C]">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`text-left py-1 px-2 rounded ${selectedCategory === 'All' ? 'bg-[#F9ECE6] text-[#1C1917] font-bold' : 'hover:text-[#1C1917]'}`}
              >
                All Categories
              </button>
              {(selectedGender !== 'All' ? CATEGORIES_CONFIG[selectedGender] : ['Tops', 'Dresses', 'Shirts', 'Ethnic Wear', 'Jeans', 'Trousers', 'Hoodies', 'Accessories']).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left py-1 px-2 rounded ${selectedCategory === cat ? 'bg-[#F9ECE6] text-[#1C1917] font-bold' : 'hover:text-[#1C1917]'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 border-t border-[#E8E1D5] pt-4">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[#1C1917]">
              <span>Max Price</span>
              <span>{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="500"
              max="6000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#1C1917]"
            />
          </div>

          {/* Size Filter Pills */}
          <div className="space-y-2 border-t border-[#E8E1D5] pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1C1917] block">Size</span>
            <div className="flex flex-wrap gap-1.5">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '8 UK'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => toggleSizeFilter(sz)}
                  className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${
                    selectedSizes.includes(sz)
                      ? 'bg-[#1C1917] text-white border-[#1C1917]'
                      : 'bg-[#FAF7F2] text-[#1C1917] border-[#E8E1D5] hover:border-[#1C1917]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Catalog Display */}
        <div className="md:col-span-3 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-xl border border-[#E8E1D5] p-8">
              <h3 className="font-serif text-2xl font-bold text-[#1C1917]">No matching products found</h3>
              <p className="text-xs text-[#78716C] mt-1">Try adjusting your filters or price slider.</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-6 py-2.5 bg-[#1C1917] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#8C6D46] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onQuickView={(p) => setQuickViewProduct(p)} 
                />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="p-4 bg-white rounded-xl border border-[#E8E1D5] flex items-center gap-6 shadow-soft">
                  <img src={product.image} alt={product.name} className="w-28 h-36 object-cover rounded bg-[#F5F0E6]" />
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D46]">{product.gender} · {product.category}</span>
                    <h3 className="font-serif text-xl font-bold text-[#1C1917]">{product.name}</h3>
                    <p className="text-xs text-[#78716C] line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-4 pt-2">
                      <span className="font-serif font-bold text-lg text-[#1C1917]">{formatPrice(product.price)}</span>
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="px-4 py-2 bg-[#1C1917] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#8C6D46] transition-colors"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Render Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />

    </div>
  );
};
