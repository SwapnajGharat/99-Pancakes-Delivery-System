import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShoppingBag,
  FiHeart,
  FiSearch,
  FiUser,
  FiMenu,
  FiX,
  FiMapPin,
  FiPhone,
  FiChevronRight,
  FiLogOut,
  FiGrid
} from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../SearchBar/SearchBar';

const Navbar = () => {
  const { cartCount, wishlist } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Offers', path: '/menu?filter=bestsellers' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Top Glass Announcement Bar */}
      <div className="bg-[#5C3D2E]/90 text-[#FFF8F0] text-xs py-1.5 px-4 hidden md:block backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-medium">
              <FiMapPin className="text-[#FFB703]" /> Shop 12, Sector 15, New Panvel East
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium">
              <FiPhone className="text-[#FFB703]" /> +91 98200 99999
            </span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span className="px-2 py-0.5 bg-[#FFB703] text-[#2D2D2D] rounded-full text-[10px] font-black">
              OPEN NOW
            </span>
            <span>10:00 AM - 11:30 PM</span>
          </div>
        </div>
      </div>

      {/* Floating Liquid Glass Header Wrapper */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 lg:px-8 pt-3 pb-2 pointer-events-none">
        <motion.div
          animate={{
            scale: isScrolled ? 0.98 : 1,
            y: isScrolled ? 2 : 0,
          }}
          transition={{ duration: 0.3 }}
          className={`max-w-7xl mx-auto rounded-full transition-all duration-500 pointer-events-auto ${
            isScrolled
              ? 'liquid-glass shadow-2xl py-2 px-6 border-white/70'
              : 'liquid-glass py-3 px-6 shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between gap-4">

            {/* Logo & Mobile Menu Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-[#5C3D2E] hover:text-[#FF4D6D] lg:hidden rounded-full hover:bg-white/50 transition-colors"
                aria-label="Open Mobile Menu"
              >
                <FiMenu className="text-2xl" />
              </button>

              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF4D6D] to-[#FFB703] flex items-center justify-center text-white text-2xl shadow-md shadow-[#FF4D6D]/30 group-hover:scale-105 transition-transform">
                  🥞
                </div>
                <div>
                  <span className="text-lg font-black text-[#5C3D2E] tracking-tight block leading-none">
                    99 Pancakes
                  </span>
                  <span className="text-[9px] font-black tracking-widest text-[#FF4D6D] uppercase block">
                    Panvel Branch
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav Links with Floating Pill Active Indicator */}
            <nav className="hidden lg:flex items-center gap-2 bg-white/40 p-1 rounded-full border border-white/60">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-xs font-bold transition-all px-4 py-2 rounded-full relative z-10 ${
                      isActive
                        ? 'text-white'
                        : 'text-[#2D2D2D] hover:text-[#FF4D6D]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10">{link.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeNavPill"
                          className="absolute inset-0 bg-gradient-to-r from-[#FF4D6D] to-[#E63956] rounded-full shadow-md z-0"
                          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}

              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `text-xs font-black transition-all px-3 py-1.5 rounded-full relative z-10 flex items-center gap-1 ${
                      isActive
                        ? 'bg-[#5C3D2E] text-[#FFB703]'
                        : 'text-[#5C3D2E] hover:text-[#FF4D6D]'
                    }`
                  }
                >
                  <FiGrid className="text-xs" /> Admin
                </NavLink>
              )}
            </nav>

            {/* Search Input Bar (Desktop) */}
            <div className="hidden md:block w-48 lg:w-56">
              <SearchBar placeholder="Search menu..." />
            </div>

            {/* Action Buttons: Search, Wishlist, Cart, User Auth */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Search Icon Mobile */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2.5 text-[#5C3D2E] hover:text-[#FF4D6D] rounded-full hover:bg-white/60 transition-colors md:hidden"
              >
                <FiSearch className="text-xl" />
              </button>

              {/* Wishlist Icon */}
              <Link
                to="/menu?filter=wishlist"
                className="relative p-2.5 text-[#5C3D2E] hover:text-[#FF4D6D] rounded-full hover:bg-white/60 transition-colors"
                title="Wishlist"
              >
                <FiHeart className="text-xl" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#FF4D6D] text-white text-[10px] font-black flex items-center justify-center shadow-md">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2.5 text-[#5C3D2E] hover:text-[#FF4D6D] rounded-full hover:bg-white/60 transition-colors"
                title="View Shopping Cart"
              >
                <FiShoppingBag className="text-xl" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-[#FFB703] text-[#2D2D2D] text-[10px] font-black flex items-center justify-center shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {/* User Profile / Auth State */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-white hover:bg-white text-[#5C3D2E] text-xs font-bold shadow-xs transition-colors"
                    title="Account Profile"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#FF4D6D] text-white flex items-center justify-center text-xs font-extrabold">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden xl:inline truncate max-w-[90px]">{user?.name?.split(' ')[0]}</span>
                  </Link>

                  <button
                    onClick={logout}
                    className="p-2 text-[#5C3D2E] hover:text-red-600 rounded-full hover:bg-white/60 transition-colors"
                    title="Log Out"
                  >
                    <FiLogOut className="text-lg" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#5C3D2E] text-white text-xs font-bold hover:bg-[#4A3024] transition-colors shadow-md cursor-pointer"
                >
                  <FiUser className="text-sm" />
                  <span>Login</span>
                </Link>
              )}
            </div>

          </div>
        </motion.div>
      </header>

      {/* Mobile Glass Slide-in Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm liquid-glass-dark z-50 p-6 flex flex-col justify-between shadow-2xl text-white overflow-y-auto lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF4D6D] to-[#FFB703] flex items-center justify-center text-white text-xl shadow-md">
                      🥞
                    </div>
                    <div>
                      <span className="text-base font-black text-white block">
                        99 Pancakes
                      </span>
                      <span className="text-[10px] font-bold text-[#FFB703] uppercase block">
                        Panvel Outlet
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10"
                  >
                    <FiX className="text-2xl" />
                  </button>
                </div>

                <div className="my-5">
                  <SearchBar placeholder="Search menu..." />
                </div>

                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center justify-between py-3 px-4 rounded-xl text-sm font-bold transition-colors ${
                          isActive
                            ? 'bg-[#FF4D6D] text-white shadow-md'
                            : 'text-white/80 hover:bg-white/10'
                        }`
                      }
                    >
                      <span>{link.name}</span>
                      <FiChevronRight className="text-base opacity-70" />
                    </NavLink>
                  ))}

                  {isAuthenticated && (
                    <>
                      <NavLink
                        to="/orders"
                        className="flex items-center justify-between py-3 px-4 rounded-xl text-sm font-bold text-white/80 hover:bg-white/10 transition-colors"
                      >
                        <span>My Orders</span>
                        <FiChevronRight className="text-base opacity-70" />
                      </NavLink>
                      <NavLink
                        to="/profile"
                        className="flex items-center justify-between py-3 px-4 rounded-xl text-sm font-bold text-white/80 hover:bg-white/10 transition-colors"
                      >
                        <span>My Profile</span>
                        <FiChevronRight className="text-base opacity-70" />
                      </NavLink>
                    </>
                  )}

                  {isAdmin && (
                    <NavLink
                      to="/admin"
                      className="flex items-center justify-between py-3 px-4 rounded-xl text-sm font-black bg-[#FFB703] text-[#2D2D2D] transition-colors"
                    >
                      <span>👑 Admin Dashboard</span>
                      <FiChevronRight className="text-base opacity-70" />
                    </NavLink>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-3">
                {isAuthenticated ? (
                  <button
                    onClick={logout}
                    className="w-full py-3 rounded-full bg-red-600/80 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <FiLogOut /> Log Out ({user?.name})
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="w-full py-3 rounded-full bg-[#FF4D6D] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md"
                  >
                    <FiUser /> Login / Sign Up
                  </Link>
                )}
                <div className="text-center text-xs text-white/60">
                  <p>📍 Sector 15, New Panvel East</p>
                  <p className="mt-0.5">📞 +91 98200 99999</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Search Modal */}
      <AnimatePresence>
        {searchModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 p-4 flex items-start justify-center pt-20 md:hidden"
          >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              className="w-full max-w-md liquid-glass rounded-3xl p-4 shadow-2xl relative border-white/80"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-[#5C3D2E]">Search Desserts</h3>
                <button
                  onClick={() => setSearchModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              <SearchBar
                onSearch={(q) => {
                  setSearchModalOpen(false);
                  navigate(`/menu?search=${encodeURIComponent(q)}`);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
