import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiHeart, FiSmile, FiShield } from 'react-icons/fi';

const About = () => {
  return (
    <div className="space-y-16 py-8 sm:py-12">
      
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF4D6D]">
          Our Story
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#5C3D2E] mt-2 leading-tight">
          Spreading Sweet Happiness in Panvel Since 2018
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed font-normal">
          99 Pancakes introduced India to authentic, bite-sized mini Dutch pancakes (Poffertjes) loaded with gourmet sauces, fresh fruits, and premium toppings.
        </p>
      </section>

      {/* Main Feature Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 lg:p-12 border border-amber-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="px-3 py-1 bg-amber-100 text-[#5C3D2E] text-xs font-bold rounded-full">
              Panvel Franchise Outlet
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D2D2D]">
              Crafted Fresh, Served Hot
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Located in the heart of Sector 15, New Panvel, our kitchen prepares every batch of mini pancakes and waffles live upon receiving your order. We source 100% pure Belgian chocolate, original hazelnut spreads, and fresh farm dairy to ensure an unbeatable taste.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Whether you are craving a late night sugar rush or celebrating a special birthday with our famous pancake towers, 99 Pancakes Panvel is your go-to dessert sanctuary.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-xl aspect-4/3 border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80"
                alt="99 Pancakes Live Preparation"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -6 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-100 shadow-xs space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FF4D6D] text-white flex items-center justify-center text-2xl shadow-md">
              <FiHeart />
            </div>
            <h3 className="text-lg font-bold text-[#2D2D2D]">Our Mission</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To deliver premium quality, freshly made Dutch mini pancakes and European desserts to dessert enthusiasts across Panvel with exceptional service.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 shadow-xs space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FFB703] text-[#2D2D2D] flex items-center justify-center text-2xl shadow-md font-bold">
              <FiAward />
            </div>
            <h3 className="text-lg font-bold text-[#2D2D2D]">Our Vision</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To be Navi Mumbai’s most loved dessert chain, celebrated for innovative pancake recipes, delightful thickshakes, and memorable food experiences.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 shadow-xs space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#5C3D2E] text-white flex items-center justify-center text-2xl shadow-md">
              <FiShield />
            </div>
            <h3 className="text-lg font-bold text-[#2D2D2D]">Quality Promise</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zero artificial preservatives, 100% vegetarian options available, and tamper-evident sealed packaging for every single online delivery.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;
