import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiArrowRight,
  FiShoppingBag,
  FiTag,
  FiCheck,
  FiInfo,
  FiArrowLeft
} from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    deliveryFee,
    taxes,
    grandTotal
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'PANVEL15') {
      const discount = Math.round(cartSubtotal * 0.15);
      setAppliedCoupon({ code: 'PANVEL15', discount, label: '15% Off Panvel Special' });
      toast.success('Coupon PANVEL15 applied successfully! Saved ' + formatPrice(discount), {
        icon: '🎉'
      });
      setCouponCode('');
    } else if (code === 'FREEDEL') {
      setAppliedCoupon({ code: 'FREEDEL', discount: deliveryFee, label: 'Free Delivery' });
      toast.success('Free Delivery coupon applied!', { icon: '🚚' });
      setCouponCode('');
    } else {
      toast.error('Invalid coupon code. Try PANVEL15 for 15% OFF!');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast('Coupon removed');
  };

  const finalTotal = Math.max(0, grandTotal - (appliedCoupon ? appliedCoupon.discount : 0));

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-amber-100 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-amber-50 text-[#FF4D6D] text-4xl flex items-center justify-center mx-auto mb-4">
            🛒
          </div>
          <h2 className="text-2xl font-extrabold text-[#5C3D2E]">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-8 leading-relaxed">
            Looks like you haven't added any sweet mini pancakes or waffles to your order yet!
          </p>
          <Link to="/menu">
            <button className="w-full py-3.5 rounded-full bg-[#FF4D6D] text-white font-bold text-sm shadow-md hover:bg-[#E63956] transition-colors">
              Explore Our Menu & Order
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-amber-200/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#5C3D2E]">Your Shopping Cart</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your delicious items before proceeding to checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
        >
          <FiTrash2 /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          {cartItems.map(({ product, quantity }) => {
            const prodId = product._id || product.id;
            const categoryName = typeof product.category === 'object' ? product.category?.name : (product.category || '');

            return (
              <motion.div
                layout
                key={prodId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-4 border border-amber-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                {/* Product Thumbnail & Info */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-2xl object-cover border border-amber-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[10px] text-amber-900/60 font-semibold mb-0.5">
                      <span>{categoryName}</span>
                      <span className={`px-1.5 py-0.2 rounded-full border text-[9px] ${
                        product.isVeg ? 'border-green-600 text-green-700' : 'border-red-600 text-red-700'
                      }`}>
                        {product.isVeg ? 'Veg' : 'Egg'}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#2D2D2D] truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs font-extrabold text-[#5C3D2E] mt-1">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>

                {/* Quantity Modifier & Subtotal */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-50">
                  
                  {/* Counter */}
                  <div className="flex items-center gap-2 border border-amber-200 rounded-full px-2 py-1 bg-[#FFF8F0]">
                    <button
                      onClick={() => updateQuantity(prodId, -1)}
                      className="w-7 h-7 rounded-full bg-white text-[#5C3D2E] hover:bg-amber-100 flex items-center justify-center font-bold text-xs cursor-pointer"
                    >
                      <FiMinus />
                    </button>
                    <span className="text-xs font-bold text-[#5C3D2E] w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(prodId, 1)}
                      className="w-7 h-7 rounded-full bg-[#5C3D2E] text-white hover:bg-[#4A3024] flex items-center justify-center font-bold text-xs cursor-pointer"
                    >
                      <FiPlus />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-black text-[#5C3D2E] block">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(prodId)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <FiTrash2 className="text-base" />
                  </button>

                </div>
              </motion.div>
            );
          })}

          {/* Delivery Note */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-900 flex items-center gap-3">
            <FiInfo className="text-lg text-[#FFB703] shrink-0" />
            <div>
              <span className="font-bold block">Panvel Delivery Express</span>
              <span>Orders placed now will arrive in 25–35 minutes at your location in Panvel!</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Coupon Code Box */}
          <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-xs">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#5C3D2E] mb-3 flex items-center gap-1.5">
              <FiTag className="text-[#FF4D6D]" /> Apply Discount Coupon
            </h4>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-green-50 border border-green-200 text-xs text-green-800">
                <div>
                  <span className="font-bold block">{appliedCoupon.code} ({appliedCoupon.label})</span>
                  <span className="text-[11px] text-green-600">Saved {formatPrice(appliedCoupon.discount)}</span>
                </div>
                <button onClick={removeCoupon} className="text-xs font-bold text-red-600 hover:underline">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Try 'PANVEL15'"
                  className="flex-1 px-4 py-2 bg-amber-50/50 border border-amber-200 rounded-full text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#5C3D2E] text-white text-xs font-bold hover:bg-[#4A3024] transition-colors"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Summary Details */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#2D2D2D] pb-3 border-b border-amber-100">
              Order Calculation
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#2D2D2D]">{formatPrice(cartSubtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                {deliveryFee === 0 ? (
                  <span className="font-bold text-green-600">FREE</span>
                ) : (
                  <span className="font-bold text-[#2D2D2D]">{formatPrice(deliveryFee)}</span>
                )}
              </div>

              <div className="flex justify-between">
                <span>GST & Taxes (5%)</span>
                <span className="font-bold text-[#2D2D2D]">{formatPrice(taxes)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-{formatPrice(appliedCoupon.discount)}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-amber-100 flex items-baseline justify-between">
              <div>
                <span className="text-base font-extrabold text-[#5C3D2E] block">Grand Total</span>
                <span className="text-[10px] text-slate-400">Inclusive of all taxes</span>
              </div>
              <span className="text-2xl font-black text-[#FF4D6D]">
                {formatPrice(finalTotal)}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-full bg-[#FF4D6D] hover:bg-[#E63956] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D6D]/30 transition-all cursor-pointer mt-4"
            >
              <span>PROCEED TO CHECKOUT</span>
              <FiArrowRight className="text-lg" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;
