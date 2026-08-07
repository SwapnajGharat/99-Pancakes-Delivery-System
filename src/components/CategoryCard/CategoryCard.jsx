import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronRight } from 'react-icons/fi';

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/menu?category=${category.slug}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="group relative liquid-glass-card rounded-3xl overflow-hidden cursor-pointer h-full flex flex-col p-2"
      >
        {/* Background Image Container */}
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-amber-50">
          <img
            src={category.image}
            alt={category.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#5C3D2E]/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

          {/* Items Count Glass Badge */}
          <div className="absolute top-3 right-3 liquid-glass-pill px-3 py-1 rounded-full text-[11px] font-extrabold text-[#5C3D2E] shadow-sm">
            {category.count} Items
          </div>
        </div>

        {/* Content Box */}
        <div className="p-3 flex-1 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#2D2D2D] group-hover:text-[#FF4D6D] transition-colors">
              {category.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {category.description}
            </p>
          </div>

          <div className="w-8 h-8 rounded-full liquid-glass-pill group-hover:bg-[#FF4D6D] text-[#5C3D2E] group-hover:text-white flex items-center justify-center transition-colors shadow-sm shrink-0">
            <FiChevronRight className="text-base" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
