import bcrypt from 'bcryptjs';
import { JsonModel } from '../utils/jsonModel.js';

export const User = new JsonModel('User', 'users', {
  phone: '',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  isActive: true,
});

User.hashPassword = (password) => bcrypt.hash(password, 10);
User.matchPassword = (user, password) => bcrypt.compare(password, user.password);
