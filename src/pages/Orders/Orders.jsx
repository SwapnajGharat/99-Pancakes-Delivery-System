import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiRefreshCw, FiMapPin, FiCalendar, FiCreditCard } from 'react-icons/fi';
import { dummyOrders } from '../../data/orders';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';

const Orders = () => {
  const handleReorder = (order) => {
    toast.success(`Re-ordered items from ${order.orderId}! Added to your cart.`, {
      icon: '🥞'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#5C3D2E]">My Order History</h1>
        <p className="text-xs text-slate-500 mt-1">
          Track and manage your past pancake & waffle orders from 99 Pancakes Panvel.
        </p>
      </div>

      {dummyOrders.length > 0 ? (
        <div className="space-y-6">
          {dummyOrders.map((order) => (
            <motion.div
              key={order.orderId}
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
                      <h3 className="text-sm font-extrabold text-[#2D2D2D]">{order.orderId}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <FiCalendar /> {order.date}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Total Amount</span>
                  <span className="text-lg font-black text-[#5C3D2E]">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Items Summary Grid */}
              <div className="divide-y divide-amber-50">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
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
                    <FiMapPin className="text-[#FF4D6D]" /> <span className="font-medium">{order.deliveryAddress}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <FiCreditCard className="text-amber-600" /> <span>Paid via {order.paymentMethod}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleReorder(order)}
                  className="px-5 py-2.5 rounded-full bg-[#FF4D6D] hover:bg-[#E63956] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer shrink-0"
                >
                  <FiRefreshCw /> Reorder Items
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 max-w-md mx-auto">
          <FiPackage className="text-4xl text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#5C3D2E]">No Past Orders Yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">Order your first batch of delicious mini pancakes!</p>
          <Link to="/menu" className="px-6 py-2.5 rounded-full bg-[#FF4D6D] text-white font-bold text-xs">
            Start Ordering
          </Link>
        </div>
      )}

    </div>
  );
};

export default Orders;
