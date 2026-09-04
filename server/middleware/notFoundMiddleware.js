import { errorResponse } from '../utils/apiResponse.js';

export const notFound = (req, res, next) => {
  return errorResponse(res, 404, `Route Not Found - ${req.originalUrl}`);
};
