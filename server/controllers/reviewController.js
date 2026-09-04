import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Get all reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let product;
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(productId);
    } else {
      product = await Product.findOne({ slug: productId.toLowerCase() });
    }

    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    const reviews = await Review.find({ product: product._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Product reviews retrieved successfully', reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product review
// @route   POST /api/products/:productId/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    let product;
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(productId);
    } else {
      product = await Product.findOne({ slug: productId.toLowerCase() });
    }

    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: product._id,
    });

    if (alreadyReviewed) {
      return errorResponse(res, 400, 'You have already reviewed this product. You can update your existing review.');
    }

    const review = await Review.create({
      user: req.user._id,
      product: product._id,
      rating: Number(rating),
      comment,
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    return successResponse(res, 201, 'Review created successfully', populatedReview);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    let review = await Review.findById(id);
    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    // Verify ownership
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Forbidden: You can only edit your own reviews');
    }

    if (rating !== undefined) review.rating = Number(rating);
    if (comment !== undefined) review.comment = comment;

    await review.save();

    const updatedReview = await Review.findById(id).populate('user', 'name avatar');

    return successResponse(res, 200, 'Review updated successfully', updatedReview);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Owner or Admin)
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    // Verify ownership or admin privileges
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Forbidden: You can only delete your own reviews');
    }

    const productId = review.product;

    await Review.findByIdAndDelete(id);

    // Recalculate rating on product
    await Review.calcAverageRating(productId);

    return successResponse(res, 200, 'Review deleted successfully');
  } catch (error) {
    next(error);
  }
};
