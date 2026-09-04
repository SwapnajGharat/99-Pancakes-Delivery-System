import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { errorResponse } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET);

      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return errorResponse(res, 401, 'User associated with token no longer exists');
      }

      if (!user.isActive) {
        return errorResponse(res, 403, 'User account is deactivated');
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('[AuthMiddleware] Token error:', error.message);
      return errorResponse(res, 401, 'Not authorized, token failed or expired');
    }
  }

  if (!token) {
    return errorResponse(res, 401, 'Not authorized, no bearer token provided');
  }
};
