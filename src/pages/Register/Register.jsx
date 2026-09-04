import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setSubmitting(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });
    setSubmitting(false);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-3xl p-8 border border-amber-100 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF4D6D] to-[#FFB703] text-white text-2xl flex items-center justify-center mx-auto shadow-md">
            🥞
          </div>
          <h1 className="text-2xl font-extrabold text-[#5C3D2E]">Create Account</h1>
          <p className="text-xs text-slate-500">Sign up to enjoy exclusive discounts & fast ordering in Panvel.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Full Name *</label>
            <div className="relative flex items-center">
              <FiUser className="absolute left-3.5 text-amber-800/60 text-base" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-full text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Email Address *</label>
            <div className="relative flex items-center">
              <FiMail className="absolute left-3.5 text-amber-800/60 text-base" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="rahul@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-full text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Phone Number *</label>
            <div className="relative flex items-center">
              <FiPhone className="absolute left-3.5 text-amber-800/60 text-base" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="98200 12345"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-full text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Password *</label>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3.5 text-amber-800/60 text-base" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-amber-50/50 border border-amber-200 rounded-full text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-amber-800/60 hover:text-[#FF4D6D]"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Confirm Password *</label>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3.5 text-amber-800/60 text-base" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-full text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-full bg-[#FF4D6D] hover:bg-[#E63956] text-white font-bold text-xs shadow-md shadow-[#FF4D6D]/30 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
          >
            <span>{submitting ? 'CREATING ACCOUNT...' : 'REGISTER ACCOUNT'}</span>
            {!submitting && <FiArrowRight />}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-4 border-t border-amber-100 text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#FF4D6D] hover:underline">
            Log In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
