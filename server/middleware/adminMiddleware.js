import { errorResponse } from '../utils/apiResponse.js';

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return errorResponse(res, 403, 'Forbidden: Admin access required');
};
