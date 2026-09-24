import { JsonModel } from '../utils/jsonModel.js';
import { User } from './User.js';
import { Product } from './Product.js';

export const Order = new JsonModel('Order', 'orders', {
  deliveryFee: 0, discount: 0, paymentMethod: 'COD', paymentStatus: 'PENDING', orderStatus: 'PENDING',
});
Order.relations = { user: { model: User }, 'items.product': { model: Product } };
