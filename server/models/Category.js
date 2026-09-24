import { JsonModel } from '../utils/jsonModel.js';

export const Category = new JsonModel('Category', 'categories', { description: '', image: '', isActive: true });
