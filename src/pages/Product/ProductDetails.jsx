import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiStar,
  FiHeart,
  FiShoppingCart,
  FiClock,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiShield,
  FiCheckCircle,
  FiMessageSquare,
  FiSend
} from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { products as fallbackProducts } from '../../data/products';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, calculateDiscount } from '../../utils/formatters';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loader from '../../components/Loader/Loader';
import { productAPI, reviewAPI } from '../../services/apiServices';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      setLoading(true);
      try {
        let prod = null;
        try {
          prod = await productAPI.getProductByIdOrSlug(id);
        } catch (err) {
          console.warn('API get product failed, using fallback:', err.message);
          prod = fallbackProducts.find((p) => p.id === id || p._id === id || p.slug === id);
        }

        if (!prod) {
          prod = fallbackProducts.find((p) => p.id === id || p._id === id || p.slug === id);
        }

        setProduct(prod);

        // Fetch reviews
        if (prod && (prod._id || prod.id)) {
          try {
            const revs = await reviewAPI.getProductReviews(prod._id || prod.id);
            setReviews(Array.isArray(revs) ? revs : []);
          } catch {
            setReviews([]);
          }
        }
      } catch (err) {
        console.error('[ProductDetails] Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to leave a review');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please write a short review comment');
      return;
    }

    const productId = product._id || product.id;
    setSubmittingReview(true);
    try {
      const created = await reviewAPI.createReview(productId, {
        rating: newRating,
        comment: newComment.trim(),
      });
      setReviews([created, ...reviews]);
      setNewComment('');
      setNewRating(5);
      toast.success('Thank you for your review!', { icon: '⭐️' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Loader text="Fetching dessert details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#5C3D2E]">Dessert Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">The requested product does not exist or has been removed.</p>
        <Link to="/menu" className="px-6 py-2.5 bg-[#FF4D6D] text-white font-semibold text-xs rounded-full shadow-md">
          Back to Menu
        </Link>
      </div>
    );
  }

  const productId = product._id || product.id;
  const isFav = isInWishlist(productId);
  const discount = calculateDiscount(product.originalPrice, product.price);
  const categoryName = typeof product.category === 'object' ? product.category?.name : (product.category || '');
  const categorySlug = typeof product.category === 'object' ? product.category?.slug : (product.categorySlug || '');

  const relatedProducts = fallbackProducts
    .filter((p) => p.id !== productId && p._id !== productId)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#FF4D6D] mb-6 transition-colors cursor-pointer"
      >
        <FiArrowLeft className="text-base" /> Back
      </button>

      {/* Main Product Showcase */}
      <div className="bg-white rounded-3xl p-6 lg:p-10 border border-amber-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-amber-50 border border-amber-100 shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-[#FF4D6D] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                {discount}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-[#FF4D6D] shadow-md transition-transform active:scale-90 cursor-pointer"
            >
              {isFav ? <FaHeart className="text-[#FF4D6D] text-xl" /> : <FiHeart className="text-xl" />}
            </button>
          </div>

          {/* Thumbnail Placeholders */}
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                  i === 0 ? 'border-[#FF4D6D] shadow-sm' : 'border-amber-100 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            
            {/* Badges */}
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                product.isVeg ? 'border-green-600 text-green-700 bg-green-50' : 'border-red-600 text-red-700 bg-red-50'
              }`}>
                <span className={`w-2 h-2 rounded-full ${product.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                {product.isVeg ? 'Pure Veg' : 'Contains Egg'}
              </span>

              {(product.isBestseller || product.featured) && (
                <span className="px-3 py-1 rounded-full bg-[#FFB703] text-[#2D2D2D] text-xs font-black uppercase">
                  Bestseller
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2D2D2D]">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 text-xs font-semibold text-amber-900/70">
              <div className="flex items-center gap-1 px-2.5 py-1 bg-[#5C3D2E] text-white rounded-full">
                <FiStar className="fill-[#FFB703] text-[#FFB703]" />
                <span>{product.rating || 4.8}</span>
              </div>
              <span>({reviews.length || product.reviewCount || product.reviewsCount || 12} verified customer reviews)</span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-black text-[#5C3D2E]">
                {formatPrice(product.price * quantity)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(product.originalPrice * quantity)}
                </span>
              )}
              {quantity > 1 && (
                <span className="text-xs text-amber-900/60 font-medium">
                  ({formatPrice(product.price)} / pc)
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-b border-amber-100 py-4">
              {product.description}
            </p>

            {/* Info Highlights */}
            <div className="grid grid-cols-2 gap-3 text-xs text-amber-900/80">
              <div className="flex items-center gap-2 p-2.5 bg-[#FFF8F0] rounded-2xl border border-amber-100">
                <FiClock className="text-[#FF4D6D] text-base" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Preparation Time</span>
                  <span className="font-bold">{product.prepTime || '10-15 mins'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-[#FFF8F0] rounded-2xl border border-amber-100">
                <FiShield className="text-[#FFB703] text-base" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Nutritional Info</span>
                  <span className="font-bold">{product.calories || '350 kcal'}</span>
                </div>
              </div>
            </div>

            {/* Ingredient Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-xs font-medium border border-amber-200/60">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quantity Modifier & Add To Cart Button */}
          <div className="space-y-4 pt-4 border-t border-amber-100">
            <div className="flex items-center gap-4">
              
              {/* Quantity Counter */}
              <div className="flex items-center justify-between border-2 border-amber-200 rounded-full p-1 w-32 bg-[#FFF8F0]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-white text-[#5C3D2E] hover:bg-amber-100 flex items-center justify-center transition-colors font-bold shadow-xs cursor-pointer"
                >
                  <FiMinus className="text-xs" />
                </button>
                <span className="text-sm font-extrabold text-[#5C3D2E]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-[#5C3D2E] text-white hover:bg-[#4A3024] flex items-center justify-center transition-colors font-bold shadow-xs cursor-pointer"
                >
                  <FiPlus className="text-xs" />
                </button>
              </div>

              {/* Add To Cart Button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => addToCart(product, quantity)}
                className="flex-1 py-3.5 px-6 rounded-full bg-[#FF4D6D] hover:bg-[#E63956] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D6D]/30 transition-all cursor-pointer"
              >
                <FiShoppingCart className="text-lg" />
                <span>ADD TO CART • {formatPrice(product.price * quantity)}</span>
              </motion.button>
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] text-amber-900/60 font-medium">
              <span className="flex items-center gap-1"><FiCheckCircle className="text-green-600" /> Tamper-Proof Sealed</span>
              <span>•</span>
              <span className="flex items-center gap-1"><FiCheckCircle className="text-green-600" /> Hot Delivery Guaranteed</span>
            </div>
          </div>

        </div>

      </div>

      {/* Customer Reviews Section */}
      <section className="bg-white rounded-3xl p-6 lg:p-8 border border-amber-100 shadow-sm space-y-6 mb-16">
        <div className="flex items-center justify-between pb-4 border-b border-amber-100">
          <div>
            <h3 className="text-xl font-extrabold text-[#5C3D2E] flex items-center gap-2">
              <FiMessageSquare className="text-[#FF4D6D]" /> Customer Reviews ({reviews.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Real feedback from 99 Pancakes Panvel food lovers.</p>
          </div>
        </div>

        {/* Review Form */}
        <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-3">
          <h4 className="text-xs font-bold text-[#5C3D2E]">Leave a Review</h4>
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-medium">Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 text-lg transition-transform hover:scale-110 cursor-pointer"
                    >
                      <FiStar
                        className={star <= newRating ? 'text-[#FFB703] fill-[#FFB703]' : 'text-slate-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about the taste, packaging, or delivery..."
                rows="2"
                required
                className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="px-5 py-2 rounded-full bg-[#FF4D6D] text-white text-xs font-bold shadow-md hover:bg-[#E63956] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <FiSend />
                <span>{submittingReview ? 'Submitting...' : 'Submit Review'}</span>
              </button>
            </form>
          ) : (
            <div className="text-xs text-slate-600 flex items-center justify-between">
              <span>Log in to write a review for this pancake item.</span>
              <Link to="/login" className="font-bold text-[#FF4D6D] hover:underline">
                Log In Now
              </Link>
            </div>
          )}
        </div>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev._id || rev.id} className="p-4 bg-white rounded-2xl border border-amber-100 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#2D2D2D]">
                    {rev.user?.name || user?.name || 'Happy Customer'}
                  </span>
                  <div className="flex items-center gap-0.5 text-xs text-[#FFB703]">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={i < rev.rating ? 'fill-[#FFB703] text-[#FFB703]' : 'text-slate-200'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                <span className="text-[10px] text-slate-400 block pt-1">
                  {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recently'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No reviews yet for this product. Be the first to leave a review!</p>
        )}
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-[#5C3D2E]">You May Also Like</h2>
            <Link to={`/menu?category=${categorySlug}`} className="text-xs font-bold text-[#FF4D6D] hover:underline">
              View All {categoryName || 'Desserts'}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel._id || rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetails;
