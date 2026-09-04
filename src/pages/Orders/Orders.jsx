import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiMapPin, FiCalendar, FiCreditCard, FiChevronRight } from 'react-icons/fi';
import { orderAPI } from '../../services/apiServices';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatters';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';

const getStatusBadgeClass = (status) => {
  switch (status?.toUpperCase()) {
    case 'DELIVERED':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'OUT_FOR_DELIVERY':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'PREPARING':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'CONFIRMED':
      return 'bg-purple-100 text-purple-700 border-purple-300';
    case 'CANCELLED':
      return 'bg-red-100 text-red-700 border-red-300';
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200';
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await orderAPI.getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('[Orders] Fetch error:', err);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleReorder = (order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        const prodObj = typeof item.product === 'object' ? item.product : { _id: item.product, name: item.name, price: item.price, image: item.image };
        addToCart(prodObj, item.quantity);
      });
      toast.success(`Re-ordered items from order #${order._id.substring(order._id.length - 6).toUpperCase()}! Added to cart.`, { icon: '🥞' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Loader text="Loading your order history..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#5C3D2E]">My Order History</h1>
        <p className="text-xs text-slate-500 mt-1">
          Track and manage your past pancake & waffle orders from 99 Pancakes Panvel.
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const orderIdShort = (order._id || '').substring((order._id || '').length - 6).toUpperCase();
            const createdDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Recently';

            return (
              <motion.div
                key={order._id}
                whileHover={{ y: -2 }}
                className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4"
              >
                {/* Top Order Metadata Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF4D6D] to-[#FFB703] text-white flex items-center justify-center text-xl shadow-xs">
                      🥞
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-[#2D2D2D]">ORDER #{orderIdShort}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <FiCalendar /> {createdDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 block">Total Amount</span>
                      <span className="text-lg font-black text-[#5C3D2E]">
                        {formatPrice(order.total)}
                      </span>
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="px-4 py-2 rounded-full bg-amber-50 hover:bg-amber-100 text-[#5C3D2E] text-xs font-bold flex items-center gap-1 border border-amber-200"
                    >
                      <span>Track Details</span>
                      <FiChevronRight />
                    </Link>
                  </div>
                </div>

                {/* Items Summary Grid */}
                <div className="divide-y divide-amber-50">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-amber-100"
                        />
                        <div>
                          <h4 className="font-bold text-[#2D2D2D] text-sm">{item.name}</h4>
                          <span className="text-slate-400">Qty: {item.quantity} × {formatPrice(item.price)}</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#5C3D2E] text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Info & Actions */}
                <div className="pt-4 border-t border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1 text-slate-500">
                    <p className="flex items-center gap-1.5">
                      <FiMapPin className="text-[#FF4D6D]" />
                      <span className="font-medium">
                        {order.shippingAddress?.addressLine || 'Panvel Store Pickup'}
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <FiCreditCard className="text-amber-600" />
                      <span>Method: {order.paymentMethod} ({order.paymentStatus})</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleReorder(order)}
                    className="px-5 py-2.5 rounded-full bg-[#FF4D6D] hover:bg-[#E63956] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer shrink-0"
                  >
                    Reorder Items
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 max-w-md mx-auto">
          <FiPackage className="text-4xl text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#5C3D2E]">No Past Orders Yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">Order your first batch of delicious mini pancakes!</p>
          <Link to="/menu" className="px-6 py-2.5 rounded-full bg-[#FF4D6D] text-white font-bold text-xs shadow-md">
            Start Ordering
          </Link>
        </div>
      )}

    </div>
  );
};

export default Orders;
