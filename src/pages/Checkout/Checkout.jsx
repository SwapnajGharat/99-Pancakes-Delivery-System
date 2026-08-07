import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMapPin,
  FiCreditCard,
  FiCheckCircle,
  FiShoppingBag,
  FiSmartphone,
  FiDollarSign,
  FiX
} from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, grandTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: 'Rahul Sharma',
    phone: '9820123456',
    email: 'rahul.sharma@example.com',
    street: 'Flat 402, Royal Palms, Sector 17',
    locality: 'New Panvel East',
    city: 'Navi Mumbai',
    pincode: '410206',
    notes: 'Please ring the doorbell. Deliver hot!'
  });

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'cod', 'card'
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.street) {
      toast.error('Please complete all required address fields!');
      return;
    }

    const newOrderId = 'ORD-99P-' + Math.floor(1000 + Math.random() * 9000);
    setPlacedOrderId(newOrderId);
    setOrderSuccessModal(true);
    clearCart();
    toast.success('Order placed successfully!', { icon: '🎉' });
  };

  if (cartItems.length === 0 && !orderSuccessModal) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-[#5C3D2E]">No Items in Checkout</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">Your cart is empty. Please add desserts before checking out.</p>
        <Link to="/menu" className="px-6 py-2 rounded-full bg-[#FF4D6D] text-white font-bold text-xs">
          Go to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#5C3D2E]">Checkout & Delivery</h1>
        <p className="text-xs text-slate-500 mt-1">Provide your delivery address in Panvel and select a payment option.</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Address & Payment */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Address Section */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-amber-100 text-[#5C3D2E]">
              <FiMapPin className="text-xl text-[#FF4D6D]" />
              <h2 className="text-base font-extrabold">1. Delivery Address (Panvel Region)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Street Address / House No. *</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Locality / Landmark</label>
                <select
                  name="locality"
                  value={formData.locality}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                >
                  <option value="New Panvel East">New Panvel East</option>
                  <option value="New Panvel West">New Panvel West</option>
                  <option value="Sector 15, Panvel">Sector 15, Panvel</option>
                  <option value="Khanda Colony">Khanda Colony</option>
                  <option value="Kamothe">Kamothe</option>
                  <option value="Old Panvel">Old Panvel</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Special Delivery Instructions</label>
                <textarea
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Leave at door, call upon arrival..."
                  className="w-full px-4 py-2 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-amber-100 text-[#5C3D2E]">
              <FiCreditCard className="text-xl text-[#FF4D6D]" />
              <h2 className="text-base font-extrabold">2. Select Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* UPI Option */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${
                  paymentMethod === 'upi'
                    ? 'border-[#FF4D6D] bg-[#FF4D6D]/5 text-[#FF4D6D]'
                    : 'border-amber-100 bg-white text-slate-600 hover:border-amber-200'
                }`}
              >
                <FiSmartphone className="text-2xl" />
                <span className="text-xs font-bold">UPI / GPay / PhonePe</span>
              </div>

              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${
                  paymentMethod === 'cod'
                    ? 'border-[#FF4D6D] bg-[#FF4D6D]/5 text-[#FF4D6D]'
                    : 'border-amber-100 bg-white text-slate-600 hover:border-amber-200'
                }`}
              >
                <FiDollarSign className="text-2xl" />
                <span className="text-xs font-bold">Cash on Delivery</span>
              </div>

              {/* Card Option */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${
                  paymentMethod === 'card'
                    ? 'border-[#FF4D6D] bg-[#FF4D6D]/5 text-[#FF4D6D]'
                    : 'border-amber-100 bg-white text-slate-600 hover:border-amber-200'
                }`}
              >
                <FiCreditCard className="text-2xl" />
                <span className="text-xs font-bold">Credit / Debit Card</span>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Order Summary Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#5C3D2E] pb-3 border-b border-amber-100">
              Order Summary ({cartItems.length} items)
            </h3>

            <div className="divide-y divide-amber-50 max-h-60 overflow-y-auto pr-1">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div className="truncate">
                      <h4 className="font-bold text-[#2D2D2D] truncate">{product.name}</h4>
                      <span className="text-slate-400">Qty: {quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#5C3D2E]">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-amber-100 flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold text-[#5C3D2E]">Total Payable</span>
                <span className="text-[10px] text-slate-400 block">Taxes included</span>
              </div>
              <span className="text-2xl font-black text-[#FF4D6D]">
                {formatPrice(grandTotal)}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#FF4D6D] hover:bg-[#E63956] text-white font-extrabold text-sm shadow-lg shadow-[#FF4D6D]/30 transition-all cursor-pointer"
            >
              CONFIRM & PLACE ORDER
            </button>
          </div>
        </div>

      </form>

      {/* Order Confirmation Success Modal */}
      <AnimatePresence>
        {orderSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 p-4 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 text-4xl flex items-center justify-center mx-auto">
                <FiCheckCircle />
              </div>

              <h2 className="text-2xl font-extrabold text-[#5C3D2E]">Order Confirmed!</h2>
              <p className="text-xs text-slate-600">
                Thank you, <span className="font-bold">{formData.fullName}</span>! Your order has been sent to our 99 Pancakes Panvel kitchen.
              </p>

              <div className="p-4 bg-[#FFF8F0] rounded-2xl border border-amber-200/60 text-left space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-bold text-[#FF4D6D]">{placedOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Est. Delivery:</span>
                  <span className="font-bold text-green-700">25 - 30 Minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivering To:</span>
                  <span className="font-bold text-[#2D2D2D] truncate max-w-[180px]">{formData.locality}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full py-3 rounded-full bg-[#5C3D2E] text-white font-bold text-xs hover:bg-[#4A3024] transition-colors"
                >
                  Track in My Orders
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-2.5 text-xs font-bold text-[#FF4D6D] hover:underline"
                >
                  Back to Home
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Checkout;
