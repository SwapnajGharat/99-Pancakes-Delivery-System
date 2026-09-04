import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiCoffee,
  FiTruck,
  FiHome,
  FiMapPin,
  FiPhone,
  FiUser,
  FiAlertCircle,
  FiXCircle
} from 'react-icons/fi';
import { orderAPI } from '../../services/apiServices';
import { formatPrice } from '../../utils/formatters';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';

const ORDER_STEPS = [
  { status: 'PENDING', label: 'Order Received', icon: FiClock, desc: 'Kitchen notified' },
  { status: 'CONFIRMED', label: 'Confirmed', icon: FiCheckCircle, desc: 'Order accepted' },
  { status: 'PREPARING', label: 'Preparing', icon: FiCoffee, desc: 'Baking mini pancakes' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: FiTruck, desc: 'Rider on the way' },
  { status: 'DELIVERED', label: 'Delivered', icon: FiHome, desc: 'Enjoy your dessert!' },
];

const getStepIndex = (status) => {
  switch (status?.toUpperCase()) {
    case 'PENDING': return 0;
    case 'CONFIRMED': return 1;
    case 'PREPARING': return 2;
    case 'OUT_FOR_DELIVERY': return 3;
    case 'DELIVERED': return 4;
    case 'CANCELLED': return -1;
    default: return 0;
  }
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await orderAPI.getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('[OrderDetails] Fetch error:', err);
        toast.error(err.response?.data?.message || 'Unable to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(true);
    try {
      const updated = await orderAPI.cancelOrder(order._id);
      setOrder(updated);
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Loader text="Retrieving live order tracking..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <FiAlertCircle className="text-4xl text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-[#5C3D2E]">Order Not Found</h2>
        <p className="text-xs text-slate-500">The requested order does not exist or you do not have permission to view it.</p>
        <Link to="/orders" className="inline-block px-6 py-2.5 rounded-full bg-[#FF4D6D] text-white font-bold text-xs shadow-md">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const currentStep = getStepIndex(order.orderStatus);
  const isCancelled = order.orderStatus === 'CANCELLED';
  const orderIdShort = (order._id || '').substring((order._id || '').length - 6).toUpperCase();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Back Link */}
      <button
        onClick={() => navigate('/orders')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#FF4D6D] mb-6 transition-colors cursor-pointer"
      >
        <FiArrowLeft className="text-base" /> Back to My Orders
      </button>

      {/* Header Info Banner */}
      <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF4D6D] to-[#FFB703] text-white flex items-center justify-center text-xl shadow-xs">
              🥞
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-[#5C3D2E]">Order #{orderIdShort}</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : 'Recently'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Current Status</span>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border mt-0.5 ${
              isCancelled
                ? 'bg-red-100 text-red-700 border-red-300'
                : 'bg-green-100 text-green-700 border-green-300'
            }`}>
              {order.orderStatus}
            </span>
          </div>

          {(order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED') && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

      {/* Glassmorphism Order Tracking Bar */}
      {!isCancelled ? (
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 mb-8 border-white/80 shadow-xl space-y-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#5C3D2E] text-center">
            Live Delivery Tracker (Panvel Outlet)
          </h2>

          <div className="relative flex items-center justify-between max-w-3xl mx-auto px-4">
            
            {/* Background Line */}
            <div className="absolute left-10 right-10 top-5 h-1 bg-amber-200/60 -z-0" />

            {/* Active Progress Line */}
            <motion.div
              className="absolute left-10 top-5 h-1 bg-gradient-to-r from-[#FF4D6D] to-[#FFB703] -z-0"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / (ORDER_STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.8 }}
            />

            {ORDER_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isDone = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={step.status} className="flex flex-col items-center relative z-10 text-center">
                  <motion.div
                    animate={{ scale: isCurrent ? 1.15 : 1 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all ${
                      isDone
                        ? 'bg-[#FF4D6D] text-white shadow-[#FF4D6D]/30'
                        : 'bg-white text-slate-400 border border-amber-200'
                    }`}
                  >
                    <Icon className="text-base" />
                  </motion.div>
                  <span className={`text-[11px] font-bold mt-2 block ${isDone ? 'text-[#5C3D2E]' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                  <span className="text-[9px] text-slate-400 hidden sm:block">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-red-50 border border-red-200 text-center text-red-700 space-y-2 mb-8">
          <FiXCircle className="text-3xl mx-auto text-red-500" />
          <h3 className="text-base font-bold">This Order Was Cancelled</h3>
          <p className="text-xs text-red-600">If you have questions, please reach out to 99 Pancakes Panvel customer support.</p>
        </div>
      )}

      {/* Main Order Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Items Breakdown */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#5C3D2E] pb-3 border-b border-amber-100">
            Ordered Items ({order.items.length})
          </h3>

          <div className="divide-y divide-amber-50">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-amber-100"
                  />
                  <div>
                    <h4 className="font-bold text-[#2D2D2D] text-sm">{item.name}</h4>
                    <span className="text-slate-400">Qty: {item.quantity} × {formatPrice(item.price)}</span>
                  </div>
                </div>
                <span className="font-extrabold text-[#5C3D2E] text-sm">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-amber-100 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-extrabold text-sm text-[#5C3D2E] pt-2 border-t border-amber-50">
              <span>Total Paid</span>
              <span className="text-[#FF4D6D] text-base">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Address & Payment Info */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Shipping Address Box */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-3">
            <h3 className="text-sm font-extrabold text-[#5C3D2E] pb-2 border-b border-amber-100 flex items-center gap-2">
              <FiMapPin className="text-[#FF4D6D]" /> Delivery Address
            </h3>

            <div className="text-xs text-slate-600 space-y-1.5">
              <p className="flex items-center gap-2 font-bold text-[#2D2D2D]">
                <FiUser className="text-slate-400" /> {order.shippingAddress?.fullName}
              </p>
              <p className="flex items-center gap-2 text-slate-500">
                <FiPhone className="text-slate-400" /> {order.shippingAddress?.phone}
              </p>
              <p className="pt-1 text-slate-700 leading-relaxed font-medium">
                {order.shippingAddress?.addressLine}, {order.shippingAddress?.landmark ? `${order.shippingAddress.landmark}, ` : ''}{order.shippingAddress?.city} - {order.shippingAddress?.pincode}
              </p>
            </div>
          </div>

          {/* Payment Info Box */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-3 text-xs">
            <h3 className="text-sm font-extrabold text-[#5C3D2E] pb-2 border-b border-amber-100">
              Payment Summary
            </h3>
            <div className="flex justify-between">
              <span className="text-slate-500">Method:</span>
              <span className="font-bold text-[#2D2D2D]">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Status:</span>
              <span className="font-bold text-green-700">{order.paymentStatus}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderDetails;
