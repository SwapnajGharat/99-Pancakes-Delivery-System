import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiStar, FiShoppingCart, FiClock } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import { formatPrice, calculateDiscount } from '../../utils/formatters';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isFav = isInWishlist(product.id);
  const discount = calculateDiscount(product.originalPrice, product.price);

  // 3D Tilt Effect State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    setRotateX(-y / 15);
    setRotateY(x / 15);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      style={{ perspective: 1000 }}
      className="group liquid-glass-card rounded-3xl p-3 flex flex-col justify-between h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-tr from-amber-50 to-white">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Veg / Non-Veg Liquid Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 liquid-glass-pill px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md">
          <span className={`w-2.5 h-2.5 rounded-full border border-white flex items-center justify-center ${product.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-[11px] text-[#2D2D2D]">
            {product.isVeg ? 'Veg' : 'Egg'}
          </span>
        </div>

        {/* Wishlist Heart Button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full liquid-glass-pill flex items-center justify-center text-slate-700 hover:text-[#FF4D6D] shadow-md transition-colors"
          title={isFav ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isFav ? (
            <FaHeart className="text-[#FF4D6D] text-base animate-in zoom-in-50" />
          ) : (
            <FiHeart className="text-base" />
          )}
        </motion.button>

        {/* Discount Tag */}
        {discount > 0 && (
          <div className="absolute bottom-3 left-3 bg-[#FF4D6D] text-white px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-md">
            {discount}% OFF
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 liquid-glass-dark text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
          <FiStar className="text-[#FFB703] fill-[#FFB703] text-xs" />
          <span>{product.rating}</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-amber-900/60 font-semibold mb-1">
            <span>{product.category}</span>
            {product.prepTime && (
              <span className="flex items-center gap-1">
                <FiClock className="text-xs" /> {product.prepTime}
              </span>
            )}
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="text-base font-extrabold text-[#2D2D2D] group-hover:text-[#FF4D6D] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-3">
            {product.description}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-amber-100/60">
          <div>
            <span className="text-lg font-black text-[#5C3D2E] block">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => addToCart(product, 1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF4D6D] to-[#E63956] text-white text-xs font-bold shadow-md shadow-[#FF4D6D]/30 transition-all cursor-pointer"
          >
            <FiShoppingCart className="text-sm" />
            <span>ADD</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
