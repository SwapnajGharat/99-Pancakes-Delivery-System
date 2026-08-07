import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShoppingBag, FiStar, FiTruck, FiAward } from 'react-icons/fi';
import Button from '../Button/Button';

const Hero = () => {
  // 3D Parallax Tilt State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    setRotateX(-y / 20);
    setRotateY(x / 20);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Text Stagger Reveal Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Text Content - Stagger Reveal */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Tagline Badge */}
            <motion.div variants={itemVariants} className="inline-block">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass text-xs font-extrabold text-[#5C3D2E] shadow-sm">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                  className="text-base"
                >
                  🥞
                </motion.span>
                <span>Panvel's #1 Specialty Dessert Destination</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#2D2D2D] tracking-tight leading-[1.08]"
            >
              Freshly Made <br className="hidden sm:inline" />
              <span className="text-gradient-liquid">
                Mini Pancakes & Waffles
              </span> <br className="hidden sm:inline" />
              Delivered Hot.
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Experience authentic Dutch pofertjes, crisp Belgian waffle grids, and rich molten chocolate cakes prepared live in New Panvel.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link to="/menu">
                <Button variant="primary" size="lg" icon={FiShoppingBag}>
                  Order Online Now
                </Button>
              </Link>
              <Link to="/menu">
                <Button variant="glass" size="lg" icon={FiArrowRight}>
                  Explore Full Menu
                </Button>
              </Link>
            </motion.div>

            {/* Floating Stat Pills */}
            <motion.div
              variants={itemVariants}
              className="pt-8 border-t border-white/60 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0"
            >
              <div className="flex items-center gap-2.5 p-2 rounded-2xl liquid-glass">
                <div className="w-9 h-9 rounded-xl bg-[#FF4D6D]/10 text-[#FF4D6D] flex items-center justify-center text-lg shrink-0 font-bold">
                  <FiTruck />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-[#2D2D2D]">30 Mins</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Panvel Express</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-2xl liquid-glass">
                <div className="w-9 h-9 rounded-xl bg-[#FFB703]/20 text-[#5C3D2E] flex items-center justify-center text-lg shrink-0 font-bold">
                  <FiStar />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-[#2D2D2D]">4.9★ Rating</h4>
                  <p className="text-[10px] text-slate-500 font-medium">10,000+ Orders</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-2xl liquid-glass">
                <div className="w-9 h-9 rounded-xl bg-[#5C3D2E]/10 text-[#5C3D2E] flex items-center justify-center text-lg shrink-0 font-bold">
                  <FiAward />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-[#2D2D2D]">100% Fresh</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Belgian Choco</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right 3D Interactive Parallax Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="lg:col-span-5 relative"
          >
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              animate={{ rotateX, rotateY }}
              transition={{ type: 'spring', damping: 20, stiffness: 150 }}
              style={{ perspective: 1000 }}
              className="relative mx-auto max-w-md lg:max-w-none cursor-pointer"
            >
              {/* Main Banner Frame */}
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl liquid-glass-card p-3 border-white/80 aspect-4/3 sm:aspect-square">
                
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1000&q=80"
                    alt="Nutella Mini Pancakes"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#5C3D2E]/90 via-transparent to-transparent" />
                  
                  {/* Chocolate Dripping CSS Animation Overlay */}
                  <div className="syrup-drip-effect hidden sm:block" />

                  {/* Caption Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="px-3 py-1 rounded-full bg-[#FFB703] text-[#2D2D2D] text-[10px] font-black uppercase shadow-sm">
                      🔥 Signature Dish
                    </span>
                    <h3 className="text-xl font-black mt-1">Nutella Mini Pancakes (12 Pcs)</h3>
                    <p className="text-xs text-amber-200 font-medium">Drenched in warm Belgian hazelnut chocolate</p>
                  </div>
                </div>

              </div>

              {/* Floating Glass Badge 1 - Free Delivery */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -top-6 -left-6 liquid-glass p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 hidden sm:flex border-white"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF4D6D] to-[#FFB703] text-white flex items-center justify-center text-xl shadow-md">
                  🥞
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#2D2D2D]">Free Delivery</h4>
                  <p className="text-[10px] text-amber-900/70 font-bold">On orders above ₹499</p>
                </div>
              </motion.div>

              {/* Floating Glass Badge 2 - Rating */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-6 -right-6 liquid-glass p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 hidden sm:flex max-w-xs border-white"
              >
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="Customer"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#FF4D6D]"
                />
                <div>
                  <div className="flex text-[#FFB703] text-xs">★★★★★</div>
                  <p className="text-[11px] font-extrabold text-[#2D2D2D]">"Best pancakes in Panvel!"</p>
                  <p className="text-[10px] text-slate-500">Ananya S., Sector 15</p>
                </div>
              </motion.div>

            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
