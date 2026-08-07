import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

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
    localStorage.setItem('99pancakes_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('99pancakes_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Add to Cart
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        toast.success(`Updated ${product.name} quantity in cart!`, {
          icon: '🥞',
          style: { background: '#5C3D2E', color: '#FFF8F0' }
        });
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
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
    setCartItems(prev => {
      const itemToRemove = prev.find(item => item.product.id === productId);
      if (itemToRemove) {
        toast.error(`Removed ${itemToRemove.product.name} from cart`, {
          style: { background: '#2D2D2D', color: '#FFF8F0' }
        });
      }
      return prev.filter(item => item.product.id !== productId);
    });
  };

  // Update Quantity
  const updateQuantity = (productId, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
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
  };

  // Toggle Wishlist
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        toast('Removed from favorites', { icon: '🤍' });
        return prev.filter(item => item.id !== product.id);
      } else {
        toast.success(`Added ${product.name} to favorites!`, { icon: '❤️' });
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
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
