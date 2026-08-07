import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiSend,
  FiHeart
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('Thank you for subscribing! Check your email for special 15% pancake discount coupon.', {
        icon: '🎉',
        style: { background: '#5C3D2E', color: '#FFF8F0' }
      });
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#5C3D2E] text-[#FFF8F0] pt-16 pb-8 border-t border-amber-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Newsletter Banner */}
        <div className="bg-gradient-to-r from-[#FF4D6D] to-[#FFB703] rounded-3xl p-6 md:p-10 mb-16 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Get Sweet Offers & Free Pancakes!
            </h3>
            <p className="text-sm text-white/90 mt-1">
              Subscribe to our Panvel newsletter and get 15% OFF on your very first online order.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="px-5 py-3 rounded-full bg-white text-[#2D2D2D] text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5C3D2E] min-w-[260px] shadow-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-[#5C3D2E] hover:bg-[#4A3024] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              <span>Subscribe</span>
              <FiSend className="text-base" />
            </button>
          </form>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF4D6D] to-[#FFB703] flex items-center justify-center text-white text-2xl shadow-md">
                🥞
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight block">
                  99 Pancakes
                </span>
                <span className="text-[10px] font-bold tracking-widest text-[#FFB703] uppercase block">
                  Panvel Outlet
                </span>
              </div>
            </div>

            <p className="text-sm text-amber-100/80 leading-relaxed">
              India's favorite specialty dessert store serving freshly baked mini pancakes, crispy waffles, thickshakes, and artisan cakes straight to your door in Panvel.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-amber-900/50 hover:bg-[#FF4D6D] text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="Instagram"
              >
                <FiInstagram className="text-base" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-amber-900/50 hover:bg-[#FF4D6D] text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="Facebook"
              >
                <FiFacebook className="text-base" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-amber-900/50 hover:bg-[#FF4D6D] text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="Twitter"
              >
                <FiTwitter className="text-base" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 border-b border-amber-900/60 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-amber-100/80">
              <li>
                <Link to="/" className="hover:text-[#FFB703] transition-colors flex items-center gap-1.5">
                  • Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-[#FFB703] transition-colors flex items-center gap-1.5">
                  • Explore Our Menu
                </Link>
              </li>
              <li>
                <Link to="/menu?filter=bestsellers" className="hover:text-[#FFB703] transition-colors flex items-center gap-1.5">
                  • Best Selling Desserts
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FFB703] transition-colors flex items-center gap-1.5">
                  • About 99 Pancakes
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FFB703] transition-colors flex items-center gap-1.5">
                  • Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 border-b border-amber-900/60 pb-2">
              Opening Hours
            </h4>
            <div className="space-y-3 text-sm text-amber-100/80">
              <div className="flex items-start gap-2.5">
                <FiClock className="text-[#FFB703] text-lg mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-white block">Monday - Sunday</span>
                  <span className="text-xs">10:00 AM – 11:30 PM</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-900/40 border border-amber-800/40 text-xs text-amber-200">
                🚀 Midnight delivery available on Friday & Saturday until 1:00 AM!
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 border-b border-amber-900/60 pb-2">
              Store Contact
            </h4>
            <ul className="space-y-3 text-sm text-amber-100/80">
              <li className="flex items-start gap-2.5">
                <FiMapPin className="text-[#FFB703] text-lg mt-0.5 shrink-0" />
                <span>Shop 12, Ground Floor, Sector 15, New Panvel East, Navi Mumbai, Maharashtra 410206</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone className="text-[#FFB703] text-base shrink-0" />
                <a href="tel:+919820099999" className="hover:text-[#FFB703] transition-colors">
                  +91 98200 99999
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="text-[#FFB703] text-base shrink-0" />
                <a href="mailto:panvel@99pancakes.in" className="hover:text-[#FFB703] transition-colors">
                  panvel@99pancakes.in
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-amber-900/60 flex flex-col md:flex-row items-center justify-between text-xs text-amber-100/60 gap-4">
          <p>© {new Date().getFullYear()} 99 Pancakes Panvel. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <FiHeart className="text-[#FF4D6D] fill-[#FF4D6D]" /> for Pancake Lovers in Panvel
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
