import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, fulfillmentType, couponCode } = req.body;

    if (!items || items.length === 0) {
      return errorResponse(res, 400, 'Cannot place an order with no items');
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine) {
      return errorResponse(res, 400, 'Complete shipping address is required');
    }

    if (paymentMethod && paymentMethod !== 'COD') {
      return errorResponse(res, 400, 'Only Cash on Delivery is currently available');
    }

    // Validate products & recalculate prices server-side to prevent fraud
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const productId = item.product || item.id || item._id;
      if (!productId) {
        return errorResponse(res, 400, 'Invalid product ID in order items');
      }

      const product = await Product.findById(productId);
      if (!product) {
        return errorResponse(res, 404, `Product not found: ${item.name || productId}`);
      }

      if (!product.isAvailable) {
        return errorResponse(res, 400, `Product "${product.name}" is currently unavailable`);
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const itemPrice = Number(product.price);
      subtotal += itemPrice * qty;

      validatedItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: itemPrice,
        quantity: qty,
      });
    }

    const isPickup = fulfillmentType === 'pickup' || shippingAddress.type === 'Pickup';
    const deliveryFee = isPickup || subtotal >= 499 ? 0 : 40;
    let numDiscount = 0;
    if (couponCode === 'PANVEL15') {
      numDiscount = Math.round(subtotal * 0.15);
    } else if (couponCode === 'FREEDEL') {
      numDiscount = deliveryFee;
    }
    const taxes = Math.round(subtotal * 0.05); // 5% GST
    const total = Math.max(0, subtotal + deliveryFee + taxes - numDiscount);

    const order = await Order.create({
      user: req.user._id,
      items: validatedItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        addressLine: shippingAddress.addressLine,
        landmark: shippingAddress.landmark || '',
        city: shippingAddress.city || 'Panvel',
        state: shippingAddress.state || 'Maharashtra',
        pincode: shippingAddress.pincode || '410206',
        type: shippingAddress.type || 'Home',
      },
      subtotal,
      deliveryFee,
      discount: numDiscount,
      total,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name image price slug');

    return successResponse(res, 201, 'Order placed successfully', populatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Orders fetched successfully', orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID (owner or admin)
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name image price slug');

    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    // Access control: order owner or admin
    if (req.user.role !== 'admin' && (!order.user || order.user._id.toString() !== req.user._id.toString())) {
      return errorResponse(res, 403, 'Forbidden: You do not have access to view this order');
    }

    return successResponse(res, 200, 'Order retrieved successfully', order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) {
      query.orderStatus = status.toUpperCase();
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const pages = Math.ceil(total / limitNum);

    return paginatedResponse(res, 200, 'All orders fetched successfully', orders, {
      page: pageNum,
      limit: limitNum,
      total,
      pages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const validStatuses = [
      'PENDING',
      'CONFIRMED',
      'PREPARING',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED',
    ];

    if (orderStatus && !validStatuses.includes(orderStatus.toUpperCase())) {
      return errorResponse(res, 400, `Invalid order status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findById(id);
    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    if (orderStatus) {
      order.orderStatus = orderStatus.toUpperCase();
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus.toUpperCase();
    }

    // If order delivered and payment was COD, set paymentStatus to PAID
    if (order.orderStatus === 'DELIVERED' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'PAID';
    }

    const updatedOrder = await order.save();
    const populatedOrder = await Order.findById(updatedOrder._id).populate('user', 'name email phone');

    return successResponse(res, 200, 'Order status updated successfully', populatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an order (Owner only if PENDING or CONFIRMED)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Forbidden: You can only cancel your own orders');
    }

    if (order.orderStatus !== 'PENDING' && order.orderStatus !== 'CONFIRMED') {
      return errorResponse(res, 400, `Cannot cancel order in ${order.orderStatus} state`);
    }

    order.orderStatus = 'CANCELLED';
    const updatedOrder = await order.save();

    return successResponse(res, 200, 'Order cancelled successfully', updatedOrder);
  } catch (error) {
    next(error);
  }
};
