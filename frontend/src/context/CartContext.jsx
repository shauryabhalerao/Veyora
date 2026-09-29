import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('veyora_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Default initial cart items matching visual reference exactly!
    return [
      {
        id: 'w-01',
        cartItemId: 'w-01-Olive Ink-M',
        name: 'The Column Dress',
        brand: 'Veyora Studio',
        selectedColor: 'Olive Ink',
        selectedSize: 'M',
        price: 3499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'w-02',
        cartItemId: 'w-02-Taupe Beige-S',
        name: 'Structured Blazer',
        brand: 'Veyora Atelier',
        selectedColor: 'Taupe Beige',
        selectedSize: 'S',
        price: 4499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'm-05',
        cartItemId: 'm-05-Sable Brown-8 UK',
        name: 'Leather Loafer',
        brand: 'Veyora Atelier',
        selectedColor: 'Sable Brown',
        selectedSize: '8 UK',
        price: 3699,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=80'
      }
    ];
  });

  const [savedForLater, setSavedForLater] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    localStorage.setItem('veyora_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, selectedColor, selectedSize, quantity = 1, customImage = null) => {
    const colorObj = typeof selectedColor === 'object' ? selectedColor : null;
    const colorName = colorObj ? colorObj.name : (selectedColor || product.colors?.[0]?.name || 'Standard');
    const sizeName = selectedSize || product.sizes?.[0] || 'M';
    const cartItemId = `${product.id}-${colorName}-${sizeName}`;

    // Determine exact image for selected color
    let itemImage = customImage || colorObj?.image;
    if (!itemImage && product.colors && Array.isArray(product.colors)) {
      const colorIndex = product.colors.findIndex(c => (typeof c === 'object' ? c.name : c) === colorName);
      if (colorIndex >= 0 && product.images && product.images[colorIndex]) {
        itemImage = product.images[colorIndex];
      }
    }
    if (!itemImage) {
      itemImage = product.image;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [
        ...prev,
        {
          id: product.id,
          cartItemId,
          name: product.name,
          brand: product.brand || 'Veyora',
          selectedColor: colorName,
          selectedSize: sizeName,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity,
          image: itemImage
        }
      ];
    });
  };

  const updateQuantity = (cartItemId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const saveForLaterItem = (cartItemId) => {
    const item = cartItems.find(i => i.cartItemId === cartItemId);
    if (item) {
      setSavedForLater(prev => [...prev, item]);
      removeFromCart(cartItemId);
    }
  };

  const moveToCartFromSaved = (savedItem) => {
    addToCart(savedItem, savedItem.selectedColor, savedItem.selectedSize, savedItem.quantity);
    setSavedForLater(prev => prev.filter(i => i.cartItemId !== savedItem.cartItemId));
  };

  const applyCouponCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'VEYORA10') {
      setAppliedCoupon({ code: 'VEYORA10', discountPercent: 10, description: '10% First Order Discount' });
      return { success: true, message: 'Coupon VEYORA10 applied! 10% discount added.' };
    } else if (cleanCode === 'FESTIVE20') {
      setAppliedCoupon({ code: 'FESTIVE20', discountPercent: 20, description: '20% Festive Special Discount' });
      return { success: true, message: 'Coupon FESTIVE20 applied! 20% discount added.' };
    } else if (cleanCode === 'FREESHIP') {
      setAppliedCoupon({ code: 'FREESHIP', freeShipping: true, description: 'Free Express Shipping' });
      return { success: true, message: 'Coupon FREESHIP applied! Free shipping granted.' };
    }
    return { success: false, message: 'Invalid coupon code. Try VEYORA10 or FESTIVE20' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  // Calculate discount
  let calculatedDiscount = 0;
  if (appliedCoupon?.discountPercent) {
    calculatedDiscount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
  }
  
  // Calculate tax (12% GST standard fashion tax)
  const estimatedTax = Math.round((subtotal - calculatedDiscount) * 0.12);
  
  // Shipping calculation (Free over ₹3000)
  const freeShippingThreshold = 3000;
  const shippingFee = (subtotal >= freeShippingThreshold || appliedCoupon?.freeShipping) ? 0 : 199;
  
  const grandTotal = subtotal - calculatedDiscount + estimatedTax + shippingFee;

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      savedForLater,
      addToCart,
      updateQuantity,
      removeFromCart,
      saveForLaterItem,
      moveToCartFromSaved,
      applyCouponCode,
      removeCoupon,
      appliedCoupon,
      subtotal,
      discountAmount: calculatedDiscount,
      estimatedTax,
      shippingFee,
      grandTotal,
      totalCount,
      freeShippingThreshold,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
