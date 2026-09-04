import api from './api';

// Helper function to extract data from standard API response structure
const handleData = (res) => res.data?.data || res.data;

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return handleData(res);
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return handleData(res);
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return handleData(res);
  },
  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },
};

// Product API
export const productAPI = {
  getProducts: async (params = {}) => {
    const res = await api.get('/products', { params });
    return res.data; // includes pagination details and data array
  },
  getProductByIdOrSlug: async (idOrSlug) => {
    const res = await api.get(`/products/${idOrSlug}`);
    return handleData(res);
  },
  createProduct: async (productData) => {
    const res = await api.post('/products', productData);
    return handleData(res);
  },
  updateProduct: async (id, productData) => {
    const res = await api.put(`/products/${id}`, productData);
    return handleData(res);
  },
  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};

// Category API
export const categoryAPI = {
  getCategories: async () => {
    const res = await api.get('/categories');
    return handleData(res);
  },
  getCategoryById: async (idOrSlug) => {
    const res = await api.get(`/categories/${idOrSlug}`);
    return handleData(res);
  },
};

// Address API
export const addressAPI = {
  getAddresses: async () => {
    const res = await api.get('/addresses');
    return handleData(res);
  },
  getAddressById: async (id) => {
    const res = await api.get(`/addresses/${id}`);
    return handleData(res);
  },
  createAddress: async (addressData) => {
    const res = await api.post('/addresses', addressData);
    return handleData(res);
  },
  updateAddress: async (id, addressData) => {
    const res = await api.put(`/addresses/${id}`, addressData);
    return handleData(res);
  },
  deleteAddress: async (id) => {
    const res = await api.delete(`/addresses/${id}`);
    return res.data;
  },
};

// Order API
export const orderAPI = {
  createOrder: async (orderData) => {
    const res = await api.post('/orders', orderData);
    return handleData(res);
  },
  getMyOrders: async () => {
    const res = await api.get('/orders');
    return handleData(res);
  },
  getOrderById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return handleData(res);
  },
  getAllOrders: async (params = {}) => {
    const res = await api.get('/orders/admin/all', { params });
    return res.data;
  },
  updateOrderStatus: async (id, statusData) => {
    const res = await api.put(`/orders/${id}/status`, statusData);
    return handleData(res);
  },
  cancelOrder: async (id) => {
    const res = await api.put(`/orders/${id}/cancel`);
    return handleData(res);
  },
};

// Review API
export const reviewAPI = {
  getProductReviews: async (productId) => {
    const res = await api.get(`/products/${productId}/reviews`);
    return handleData(res);
  },
  createReview: async (productId, reviewData) => {
    const res = await api.post(`/products/${productId}/reviews`, reviewData);
    return handleData(res);
  },
  deleteReview: async (reviewId) => {
    const res = await api.delete(`/reviews/${reviewId}`);
    return res.data;
  },
};

// User Profile API
export const userAPI = {
  getProfile: async () => {
    const res = await api.get('/users/profile');
    return handleData(res);
  },
  updateProfile: async (profileData) => {
    const res = await api.put('/users/profile', profileData);
    return handleData(res);
  },
};
