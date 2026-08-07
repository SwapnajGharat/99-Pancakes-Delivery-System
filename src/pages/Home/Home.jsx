import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiHeart, FiStar } from 'react-icons/fi';
import Hero from '../../components/Hero/Hero';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import ProductCard from '../../components/ProductCard/ProductCard';
import Button from '../../components/Button/Button';
import { categories } from '../../data/categories';
import { products } from '../../data/products';
import { reviews } from '../../data/reviews';

const Home = () => {
  const featuredProducts = products.filter(p => p.isBestseller).slice(0, 8);

  const whyChooseUs = [
    {
      id: 1,
      title: 'Fresh Ingredients',
      desc: 'We use 100% pure Belgian chocolate, original Nutella, and fresh dairy ingredients prepared daily.',
      icon: '🍓',
      bg: 'bg-rose-50 border-rose-200'
    },
    {
      id: 2,
      title: 'Fast Delivery in Panvel',
      desc: 'Hot and crispy desserts delivered straight from our kitchen to your doorstep within 30 minutes.',
      icon: '🚀',
      bg: 'bg-amber-50 border-amber-200'
    },
    {
      id: 3,
      title: 'Affordable Prices',
      desc: 'Gourmet dessert experience starting at just ₹149 with frequent combo deals and discounts.',
      icon: '💰',
      bg: 'bg-emerald-50 border-emerald-200'
    },
    {
      id: 4,
      title: 'Premium Quality',
      desc: 'Strict hygiene protocols, tamper-proof packaging, and zero artificial preservatives.',
      icon: '👑',
      bg: 'bg-purple-50 border-purple-200'
    }
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-12">
      
      {/* Hero Banner Section */}
      <Hero />

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF4D6D]">
              Explore Delights
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2D2D2D] mt-1">
              Browse Our Categories
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#FF4D6D] hover:text-[#E63956] transition-colors mt-2 md:mt-0"
          >
            <span>View All Categories</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Bestseller Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FFB703]">
              Customer Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2D2D2D] mt-1">
              Popular Bestsellers in Panvel
            </h2>
          </div>
          <Link to="/menu?filter=bestsellers">
            <Button variant="outline" size="sm" icon={FiArrowRight}>
              Explore Full Menu
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white/80 border-y border-amber-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF4D6D]">
              Our Promise
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#5C3D2E] mt-1">
              Why Panvel Loves 99 Pancakes
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              We take pride in bringing happiness to your celebrations with every bite.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -6 }}
                className={`p-6 rounded-3xl border ${item.bg} transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between`}
              >
                <div>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-[#2D2D2D] mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#5C3D2E]">
                  <FiCheckCircle className="text-green-600" /> Guaranteed Quality
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#FFB703]">
            Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2D2D2D] mt-1">
            Loved by 10,000+ Dessert Fans
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Read real reviews from our valued customers in New Panvel, Khanda Colony, and Kamothe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <motion.div
              key={rev.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex text-[#FFB703] text-sm mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <FiStar key={i} className="fill-[#FFB703]" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-amber-50">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#FF4D6D]"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#2D2D2D]">{rev.name}</h4>
                  <p className="text-[11px] text-amber-900/60">{rev.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
