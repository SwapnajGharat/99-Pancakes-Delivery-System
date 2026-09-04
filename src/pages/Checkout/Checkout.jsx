import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiMapPin,
  FiCreditCard,
  FiShoppingBag,
  FiSmartphone,
  FiDollarSign,
  FiPlus,
  FiCheck,
  FiTruck,
  FiPackage
} from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatters';
import { addressAPI, orderAPI } from '../../services/apiServices';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, cartSubtotal, deliveryFee, taxes, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fulfillmentType, setFulfillmentType] = useState('delivery'); // 'delivery', 'pickup'
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: '',
    landmark: '',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    pincode: '410206',
    type: 'Home',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD', 'ONLINE'
  const [submittingOrder, setSubmittingOrder] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const addrs = await addressAPI.getAddresses();
        if (Array.isArray(addrs) && addrs.length > 0) {
          setSavedAddresses(addrs);
          const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
          setSelectedAddressId(defaultAddr._id);
        } else {
          setShowAddressForm(true);
        }
      } catch (err) {
        console.warn('[Checkout] Failed to fetch addresses:', err.message);
        setShowAddressForm(true);
      }
    };

    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.addressLine) {
      toast.error('Please complete all required address fields!');
      return;
    }

    try {
      const created = await addressAPI.createAddress(formData);
      setSavedAddresses([created, ...savedAddresses]);
      setSelectedAddressId(created._id);
      setShowAddressForm(false);
      toast.success('Address saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    let shippingAddress = null;

    if (fulfillmentType === 'delivery') {
      if (selectedAddressId) {
        const addrObj = savedAddresses.find((a) => a._id === selectedAddressId);
        if (addrObj) {
          shippingAddress = {
            fullName: addrObj.fullName,
            phone: addrObj.phone,
            addressLine: addrObj.addressLine,
            landmark: addrObj.landmark || '',
            city: addrObj.city || 'Panvel',
            state: addrObj.state || 'Maharashtra',
            pincode: addrObj.pincode || '410206',
            type: addrObj.type || 'Home',
          };
        }
      }

      if (!shippingAddress) {
        if (!formData.fullName || !formData.phone || !formData.addressLine) {
          toast.error('Please provide a complete delivery address!');
          return;
        }
        shippingAddress = {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine: formData.addressLine,
          landmark: formData.landmark || '',
          city: formData.city || 'Panvel',
          state: formData.state || 'Maharashtra',
          pincode: formData.pincode || '410206',
          type: formData.type || 'Home',
        };
      }
    } else {
      // Pickup address placeholder
      shippingAddress = {
        fullName: user?.name || 'Customer Pickup',
        phone: user?.phone || '9820099999',
        addressLine: '99 Pancakes Panvel Outlet (Store Pickup), Shop 12, Sector 15',
        landmark: 'New Panvel East',
        city: 'Panvel',
        state: 'Maharashtra',
        pincode: '410206',
        type: 'Pickup',
      };
    }

    // Prepare order items
    const orderItems = cartItems.map(({ product, quantity }) => ({
      product: product._id || product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
    }));

    setSubmittingOrder(true);
    try {
      const createdOrder = await orderAPI.createOrder({
        items: orderItems,
        shippingAddress,
        paymentMethod,
        discount: 0,
      });

      clearCart();
      toast.success('Order placed successfully!', { icon: '🎉' });
      navigate(`/orders/${createdOrder._id || createdOrder.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-[#5C3D2E]">No Items in Checkout</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">Your cart is empty. Please add desserts before checking out.</p>
        <Link to="/menu" className="px-6 py-2.5 rounded-full bg-[#FF4D6D] text-white font-bold text-xs shadow-md">
          Go to Menu
        </Link>
      </div>
    );
  }

  const effectiveDeliveryFee = fulfillmentType === 'pickup' ? 0 : deliveryFee;
  const finalPayable = cartSubtotal + effectiveDeliveryFee + taxes;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#5C3D2E]">Checkout & Order Confirmation</h1>
        <p className="text-xs text-slate-500 mt-1">Select fulfillment, address, and payment options for 99 Pancakes Panvel.</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Fulfillment, Address & Payment */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Fulfillment Mode Toggle */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-[#5C3D2E] pb-3 border-b border-amber-100 flex items-center gap-2">
              <FiTruck className="text-[#FF4D6D]" /> 1. Order Fulfillment Type
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setFulfillmentType('delivery')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                  fulfillmentType === 'delivery'
                    ? 'border-[#FF4D6D] bg-[#FF4D6D]/5 text-[#FF4D6D]'
                    : 'border-amber-100 bg-white text-slate-600'
                }`}
              >
                <FiTruck className="text-xl" />
                <div>
                  <span className="text-xs font-bold block">Home Delivery</span>
                  <span className="text-[10px] text-slate-400 block">Delivered hot to your door</span>
                </div>
              </div>

              <div
                onClick={() => setFulfillmentType('pickup')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                  fulfillmentType === 'pickup'
                    ? 'border-[#FF4D6D] bg-[#FF4D6D]/5 text-[#FF4D6D]'
                    : 'border-amber-100 bg-white text-slate-600'
                }`}
              >
                <FiPackage className="text-xl" />
                <div>
                  <span className="text-xs font-bold block">Store Pickup</span>
                  <span className="text-[10px] text-slate-400 block">Collect from Panvel outlet</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address Section */}
          {fulfillmentType === 'delivery' && (
            <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100 text-[#5C3D2E]">
                <h2 className="text-base font-extrabold flex items-center gap-2">
                  <FiMapPin className="text-[#FF4D6D]" /> 2. Delivery Address (Panvel Region)
                </h2>
                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="text-xs font-bold text-[#FF4D6D] hover:underline flex items-center gap-1"
                  >
                    <FiPlus /> {showAddressForm ? 'Select Saved Address' : 'Add New Address'}
                  </button>
                )}
              </div>

              {/* Saved Addresses Selector */}
              {!showAddressForm && savedAddresses.length > 0 ? (
                <div className="space-y-3">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 text-xs ${
                        selectedAddressId === addr._id
                          ? 'border-[#FF4D6D] bg-amber-50/50'
                          : 'border-amber-100 bg-white hover:border-amber-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#5C3D2E] uppercase text-[10px] px-2 py-0.5 bg-amber-100 rounded-md">
                            {addr.type || 'Home'}
                          </span>
                          <span className="font-bold text-[#2D2D2D]">{addr.fullName} ({addr.phone})</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{addr.addressLine}, {addr.city} - {addr.pincode}</p>
                      </div>
                      {selectedAddressId === addr._id && (
                        <FiCheck className="text-[#FF4D6D] text-lg shrink-0 mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* New Address Form */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Rahul Sharma"
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
                      placeholder="98200 12345"
                      required
                      className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Address Line *</label>
                    <input
                      type="text"
                      name="addressLine"
                      value={formData.addressLine}
                      onChange={handleChange}
                      placeholder="Flat 402, Royal Palms, Sector 17, New Panvel East"
                      required
                      className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Landmark / Locality</label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      placeholder="Near Orion Mall"
                      className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="410206"
                      className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                    />
                  </div>

                  {savedAddresses.length > 0 && (
                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        onClick={handleCreateAddress}
                        className="px-5 py-2 bg-[#5C3D2E] text-white text-xs font-bold rounded-full hover:bg-[#4A3024] transition-colors"
                      >
                        Save This Address
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Payment Method Section */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-amber-100 text-[#5C3D2E]">
              <FiCreditCard className="text-xl text-[#FF4D6D]" />
              <h2 className="text-base font-extrabold">3. Payment Option</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${
                  paymentMethod === 'COD'
                    ? 'border-[#FF4D6D] bg-[#FF4D6D]/5 text-[#FF4D6D]'
                    : 'border-amber-100 bg-white text-slate-600 hover:border-amber-200'
                }`}
              >
                <FiDollarSign className="text-2xl" />
                <span className="text-xs font-bold">Cash / Pay on Delivery</span>
                <span className="text-[10px] text-slate-400">Pay cash or UPI upon delivery</span>
              </div>

              {/* Online Payment Placeholder */}
              <div
                onClick={() => setPaymentMethod('ONLINE')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${
                  paymentMethod === 'ONLINE'
                    ? 'border-[#FF4D6D] bg-[#FF4D6D]/5 text-[#FF4D6D]'
                    : 'border-amber-100 bg-white text-slate-600 hover:border-amber-200'
                }`}
              >
                <FiSmartphone className="text-2xl" />
                <span className="text-xs font-bold">Online Payment (UPI / Card)</span>
                <span className="text-[10px] text-slate-400">Instant digital payment</span>
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
                <div key={product._id || product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
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

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-amber-50">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{effectiveDeliveryFee === 0 ? 'FREE' : formatPrice(effectiveDeliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST & Taxes (5%)</span>
                <span>{formatPrice(taxes)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-100 flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold text-[#5C3D2E]">Total Payable</span>
                <span className="text-[10px] text-slate-400 block">Taxes included</span>
              </div>
              <span className="text-2xl font-black text-[#FF4D6D]">
                {formatPrice(finalPayable)}
              </span>
            </div>

            <button
              type="submit"
              disabled={submittingOrder}
              className="w-full py-4 rounded-full bg-[#FF4D6D] hover:bg-[#E63956] text-white font-extrabold text-sm shadow-lg shadow-[#FF4D6D]/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {submittingOrder ? 'PLACING YOUR ORDER...' : 'CONFIRM & PLACE ORDER'}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};

export default Checkout;
