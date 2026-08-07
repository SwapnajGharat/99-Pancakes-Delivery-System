import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowRight } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Animated Pancake Graphic */}
        <motion.div
          animate={{
            rotate: [0, -10, 10, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: 'easeInOut',
          }}
          className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#FF4D6D] to-[#FFB703] text-white text-5xl flex items-center justify-center mx-auto shadow-2xl shadow-[#FF4D6D]/30 border-4 border-white"
        >
          🥞
        </motion.div>

        <div>
          <span className="text-4xl sm:text-5xl font-black text-[#FF4D6D]">404</span>
          <h1 className="text-2xl font-extrabold text-[#5C3D2E] mt-2">
            Oops! This Pancake Rolled Away
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            The page you are looking for doesn't exist or has been moved to a sweeter location.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FF4D6D] hover:bg-[#E63956] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md">
              <FiHome /> Go to Homepage
            </button>
          </Link>
          <Link to="/menu">
            <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-amber-50 hover:bg-amber-100 text-[#5C3D2E] text-xs font-bold flex items-center justify-center gap-2 border border-amber-200">
              <span>View Desserts</span>
              <FiArrowRight />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
