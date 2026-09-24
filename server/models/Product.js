import { JsonModel } from '../utils/jsonModel.js';
import { Category } from './Category.js';

export const Product = new JsonModel('Product', 'products', {
  images: [], rating: 0, reviewCount: 0, isVeg: true, isAvailable: true,
  stock: 50, featured: false, prepTime: '10-15 mins', calories: '', tags: [],
});
Product.relations = { category: { model: Category } };
