import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const getProductId = (p) => {
  if (!p) return '';
  if (typeof p === 'string') return p;
  return p._id || p.id || '';
};

export const CartProvider = ({ children }) => {
  // Load initial cart & wishlist from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('99pancakes_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('99pancakes_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('99pancakes_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('[CartContext] Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('99pancakes_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('[CartContext] Failed to save wishlist to localStorage:', e);
    }
  }, [wishlist]);

  // Add to Cart
  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    const targetId = getProductId(product);

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => getProductId(item.product) === targetId);
      if (existingIndex > -1) {
        toast.success(`Updated ${product.name} quantity in cart!`, {
          icon: '🥞',
          style: { background: '#5C3D2E', color: '#FFF8F0' }
        });
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }
      toast.success(`Added ${product.name} to your cart!`, {
        icon: '🍓',
        style: { background: '#FF4D6D', color: '#FFFFFF' }
      });
      return [...prev, { product, quantity }];
    });
  };

  // Remove from Cart
  const removeFromCart = (productId) => {
    const targetId = getProductId(productId);
    setCartItems(prev => {
      const itemToRemove = prev.find(item => getProductId(item.product) === targetId);
      if (itemToRemove) {
        toast.error(`Removed ${itemToRemove.product.name} from cart`, {
          style: { background: '#2D2D2D', color: '#FFF8F0' }
        });
      }
      return prev.filter(item => getProductId(item.product) !== targetId);
    });
  };

  // Update Quantity
  const updateQuantity = (productId, delta) => {
    const targetId = getProductId(productId);
    setCartItems(prev => {
      return prev.map(item => {
        if (getProductId(item.product) === targetId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
    });
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('99pancakes_cart');
  };

  // Toggle Wishlist
  const toggleWishlist = (product) => {
    if (!product) return;
    const targetId = getProductId(product);

    setWishlist(prev => {
      const exists = prev.some(item => getProductId(item) === targetId);
      if (exists) {
        toast('Removed from favorites', { icon: '🤍' });
        return prev.filter(item => getProductId(item) !== targetId);
      } else {
        toast.success(`Added ${product.name} to favorites!`, { icon: '❤️' });
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    const targetId = getProductId(productId);
    return wishlist.some(item => getProductId(item) === targetId);
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + Number(item.product?.price || 0) * item.quantity, 0);
  const deliveryFee = cartSubtotal === 0 ? 0 : cartSubtotal >= 499 ? 0 : 40;
  const taxes = Math.round(cartSubtotal * 0.05); // 5% GST
  const grandTotal = cartSubtotal + deliveryFee + taxes;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        cartSubtotal,
        deliveryFee,
        taxes,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
