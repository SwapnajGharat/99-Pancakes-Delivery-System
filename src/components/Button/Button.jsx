import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'chocolate', 'glass', 'outline'
  size = 'md', // 'sm', 'md', 'lg'
  fullWidth = false,
  className = '',
  icon: Icon,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-bold transition-all duration-300 rounded-full focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden backdrop-blur-md border';

  const variants = {
    primary: 'bg-gradient-to-r from-[#FF4D6D] to-[#E63956] text-white border-[#FF4D6D]/40 shadow-lg shadow-[#FF4D6D]/25 hover:shadow-[#FF4D6D]/40 hover:border-[#FF4D6D]',
    secondary: 'bg-gradient-to-r from-[#FFB703] to-[#E0A000] text-[#2D2D2D] border-[#FFB703]/50 shadow-lg shadow-[#FFB703]/25 hover:shadow-[#FFB703]/40',
    chocolate: 'bg-gradient-to-r from-[#5C3D2E] to-[#4A3024] text-[#FFF8F0] border-[#5C3D2E]/40 shadow-lg shadow-[#5C3D2E]/30 hover:border-[#FF4D6D]/50',
    glass: 'liquid-glass text-[#2D2D2D] hover:text-[#FF4D6D] hover:bg-white/80 border-white/80 shadow-md',
    outline: 'bg-white/40 text-[#FF4D6D] border-[#FF4D6D]/50 hover:bg-[#FF4D6D] hover:text-white shadow-sm',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-6 py-3 text-sm gap-2',
    lg: 'px-8 py-4 text-base gap-2.5',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Liquid Reflection Glow Overlay */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

      {Icon && <Icon className="text-lg relative z-10 shrink-0" />}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default Button;
