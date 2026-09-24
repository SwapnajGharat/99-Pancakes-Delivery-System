import { JsonModel } from '../utils/jsonModel.js';
import { Product } from './Product.js';
import { User } from './User.js';

export const Review = new JsonModel('Review', 'reviews');
Review.relations = { user: { model: User } };
Review.calcAverageRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const rating = reviews.length
    ? Math.round((reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length) * 10) / 10
    : 0;
  await Product.findByIdAndUpdate(productId, { rating, reviewCount: reviews.length });
};
const originalCreate = Review.create.bind(Review);
Review.create = async (input) => {
  const review = await originalCreate(input);
  await Review.calcAverageRating(review.product);
  return review;
};
