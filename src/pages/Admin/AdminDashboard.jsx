import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FiPackage,
  FiShoppingBag,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiCheckCircle,
  FiRefreshCw,
  FiGrid,
  FiList
} from 'react-icons/fi';
import { orderAPI, productAPI, categoryAPI } from '../../services/apiServices';
import { formatPrice } from '../../utils/formatters';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';

const ORDER_STATUS_OPTIONS = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products'

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // Products State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    image: '',
    isVeg: true,
    isAvailable: true,
    stock: 50,
    prepTime: '10-15 mins',
  });
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Load Admin Orders
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const params = {};
      if (selectedStatusFilter !== 'ALL') {
        params.status = selectedStatusFilter;
      }
      const res = await orderAPI.getAllOrders(params);
      setOrders(res?.data || []);
    } catch (err) {
      console.error('[Admin] Fetch orders error:', err);
      toast.error('Failed to load admin orders');
    } finally {
      setOrdersLoading(false);
    }
  }, [selectedStatusFilter]);

  // Load Admin Products & Categories
  const fetchProductsAndCategories = useCallback(async () => {
    setProductsLoading(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        productAPI.getProducts({ limit: 100 }),
        categoryAPI.getCategories(),
      ]);
      setProducts(prodsRes?.data || []);
      setCategories(catsRes || []);
    } catch (err) {
      console.error('[Admin] Fetch products error:', err);
      toast.error('Failed to load products for management');
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    else fetchProductsAndCategories();
  }, [activeTab, fetchOrders, fetchProductsAndCategories]);

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, { orderStatus: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  // Open Create Product Modal
  const openCreateProductModal = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: categories[0]?._id || '',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80',
      isVeg: true,
      isAvailable: true,
      stock: 50,
      prepTime: '10-15 mins',
    });
    setShowProductModal(true);
  };

  // Open Edit Product Modal
  const openEditProductModal = (prod) => {
    setEditingProductId(prod._id);
    setProductForm({
      name: prod.name,
      description: prod.description || '',
      price: prod.price,
      originalPrice: prod.originalPrice || '',
      category: typeof prod.category === 'object' ? prod.category?._id : prod.category,
      image: prod.image,
      isVeg: prod.isVeg !== undefined ? prod.isVeg : true,
      isAvailable: prod.isAvailable !== undefined ? prod.isAvailable : true,
      stock: prod.stock || 50,
      prepTime: prod.prepTime || '10-15 mins',
    });
    setShowProductModal(true);
  };

  // Save Product (Create or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast.error('Please fill in required fields (Name, Price, Category)');
      return;
    }

    setSubmittingProduct(true);
    try {
      if (editingProductId) {
        await productAPI.updateProduct(editingProductId, productForm);
        toast.success('Product updated successfully!');
      } else {
        await productAPI.createProduct(productForm);
        toast.success('New product created!');
      }
      setShowProductModal(false);
      fetchProductsAndCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.deleteProduct(id);
      toast.success('Product deleted');
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Admin Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-amber-200/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#5C3D2E] text-[#FFB703] rounded-full text-xs font-black uppercase">
              👑 ADMIN PANEL
            </span>
            <span className="text-xs text-slate-500">• Panvel Outlet Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#5C3D2E] mt-1">
            Store Administration
          </h1>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 bg-amber-50 p-1.5 rounded-full border border-amber-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#FF4D6D] text-white shadow-md'
                : 'text-[#5C3D2E] hover:bg-amber-100'
            }`}
          >
            <FiShoppingBag /> Orders Management
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#FF4D6D] text-white shadow-md'
                : 'text-[#5C3D2E] hover:bg-amber-100'
            }`}
          >
            <FiGrid /> Product Catalog
          </button>
        </div>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Status Filter Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-amber-100 shadow-xs">
            <h2 className="text-sm font-extrabold text-[#5C3D2E] flex items-center gap-2">
              <FiList /> Filter Orders Status:
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                  selectedStatusFilter === 'ALL'
                    ? 'bg-[#5C3D2E] text-white'
                    : 'bg-amber-50 text-slate-700 hover:bg-amber-100'
                }`}
              >
                ALL
              </button>
              {ORDER_STATUS_OPTIONS.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                    selectedStatusFilter === st
                      ? 'bg-[#FF4D6D] text-white'
                      : 'bg-amber-50 text-slate-700 hover:bg-amber-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table / List */}
          {ordersLoading ? (
            <div className="py-16 text-center">
              <Loader text="Fetching store orders..." />
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((ord) => {
                const orderIdShort = (ord._id || '').substring((ord._id || '').length - 6).toUpperCase();
                const formattedDate = ord.createdAt ? new Date(ord.createdAt).toLocaleString('en-IN') : 'Recently';

                return (
                  <div
                    key={ord._id}
                    className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-amber-100">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-[#FF4D6D] text-base">#{orderIdShort}</span>
                          <span className="text-xs text-slate-500 font-medium">{formattedDate}</span>
                        </div>
                        <p className="text-xs font-bold text-[#2D2D2D] mt-0.5">
                          Customer: {ord.user?.name || 'Guest'} ({ord.user?.email || 'N/A'} • {ord.shippingAddress?.phone || 'N/A'})
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block uppercase">Total Amount</span>
                          <span className="text-base font-black text-[#5C3D2E]">{formatPrice(ord.total)}</span>
                        </div>

                        {/* Status Change Selector */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-bold text-slate-600 hidden sm:inline">Status:</label>
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                            className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-extrabold text-[#5C3D2E] focus:ring-2 focus:ring-[#FF4D6D] cursor-pointer"
                          >
                            {ORDER_STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 bg-amber-50/50 rounded-xl border border-amber-100">
                          <img src={it.image} alt={it.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-[#2D2D2D] truncate">{it.name}</h5>
                            <span className="text-slate-500">Qty: {it.quantity} × {formatPrice(it.price)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Address & Payment Info */}
                    <div className="pt-2 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-amber-50">
                      <p>📍 <span className="font-medium text-[#2D2D2D]">{ord.shippingAddress?.addressLine}, {ord.shippingAddress?.city}</span></p>
                      <p>💳 Payment: <span className="font-bold text-[#5C3D2E]">{ord.paymentMethod}</span> ({ord.paymentStatus})</p>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-amber-100">
              <p className="text-sm font-bold text-[#5C3D2E]">No orders found for this status filter.</p>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-amber-100 shadow-xs">
            <h2 className="text-sm font-extrabold text-[#5C3D2E]">
              Total Catalog Products ({products.length})
            </h2>

            <button
              onClick={openCreateProductModal}
              className="px-5 py-2 rounded-full bg-[#FF4D6D] hover:bg-[#E63956] text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <FiPlus className="text-base" /> Add New Dessert Product
            </button>
          </div>

          {productsLoading ? (
            <div className="py-16 text-center">
              <Loader text="Loading dessert products..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div key={prod._id} className="bg-white rounded-3xl p-4 border border-amber-100 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="flex items-center gap-4">
                    <img src={prod.image} alt={prod.name} className="w-20 h-20 rounded-2xl object-cover border border-amber-100 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-[10px] text-amber-900/60 font-semibold mb-0.5">
                        <span>{typeof prod.category === 'object' ? prod.category?.name : prod.category}</span>
                        <span className={`px-1.5 py-0.2 rounded-full border text-[9px] ${prod.isVeg ? 'border-green-600 text-green-700' : 'border-red-600 text-red-700'}`}>
                          {prod.isVeg ? 'Veg' : 'Egg'}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#2D2D2D] truncate">{prod.name}</h4>
                      <p className="text-sm font-black text-[#5C3D2E] mt-1">{formatPrice(prod.price)}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">{prod.description}</p>

                  <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs">
                    <span className={`font-bold text-[11px] ${prod.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                      {prod.isAvailable ? '● In Stock' : '○ Out of Stock'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditProductModal(prod)}
                        className="px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-[#5C3D2E] font-bold text-xs flex items-center gap-1 border border-amber-200 cursor-pointer"
                      >
                        <FiEdit3 /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                        title="Delete product"
                      >
                        <FiTrash2 className="text-base" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 p-4 flex items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 my-8">
            <h3 className="text-lg font-extrabold text-[#5C3D2E] pb-2 border-b border-amber-100">
              {editingProductId ? 'Edit Product' : 'Add New Dessert Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#2D2D2D] block mb-1">Product Title *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Nutella Mini Pancakes"
                  required
                  className="w-full px-3 py-2 bg-amber-50/50 border border-amber-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#2D2D2D] block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="199"
                    required
                    className="w-full px-3 py-2 bg-amber-50/50 border border-amber-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#2D2D2D] block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    placeholder="249"
                    className="w-full px-3 py-2 bg-amber-50/50 border border-amber-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#2D2D2D] block mb-1">Category *</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-amber-50/50 border border-amber-200 rounded-xl"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#2D2D2D] block mb-1">Image URL *</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  required
                  className="w-full px-3 py-2 bg-amber-50/50 border border-amber-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-[#2D2D2D] block mb-1">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows="2"
                  placeholder="Fresh mini pancakes smothered in rich chocolate..."
                  className="w-full px-3 py-2 bg-amber-50/50 border border-amber-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={productForm.isVeg}
                    onChange={(e) => setProductForm({ ...productForm, isVeg: e.target.checked })}
                    className="rounded text-[#FF4D6D]"
                  />
                  <span>Pure Veg</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={productForm.isAvailable}
                    onChange={(e) => setProductForm({ ...productForm, isAvailable: e.target.checked })}
                    className="rounded text-[#FF4D6D]"
                  />
                  <span>Available / In Stock</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-amber-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2 text-slate-500 font-bold hover:underline cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProduct}
                  className="px-6 py-2.5 rounded-full bg-[#FF4D6D] hover:bg-[#E63956] text-white font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submittingProduct ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
