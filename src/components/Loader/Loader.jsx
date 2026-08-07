import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false, message = 'Preparing your sweet treats...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'easeInOut',
        }}
        className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-[#FF4D6D]/10 border-2 border-[#FF4D6D] text-3xl shadow-lg"
      >
        🥞
      </motion.div>
      <div className="flex items-center space-x-1.5 mb-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D6D] animate-ping" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FFB703] animate-ping delay-100" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#5C3D2E] animate-ping delay-200" />
      </div>
      <p className="text-[#5C3D2E] font-medium text-sm">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#FFF8F0]/90 backdrop-blur-md z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
