import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      toast.success('Successfully logged in!', { icon: '👋' });
      navigate('/');
    } else {
      toast.error('Please enter email and password');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20">
      <div className="bg-white rounded-3xl p-8 border border-amber-100 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF4D6D] to-[#FFB703] text-white text-2xl flex items-center justify-center mx-auto shadow-md">
            🥞
          </div>
          <h1 className="text-2xl font-extrabold text-[#5C3D2E]">Welcome Back!</h1>
          <p className="text-xs text-slate-500">Log in to track your 99 Pancakes orders in Panvel.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Email Address</label>
            <div className="relative flex items-center">
              <FiMail className="absolute left-3.5 text-amber-800/60 text-base" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-full text-xs text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Password</label>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3.5 text-amber-800/60 text-base" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-[#FF4D6D] focus:ring-[#FF4D6D]"
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); toast('Password reset link sent to email!'); }} className="font-bold text-[#FF4D6D] hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#FF4D6D] hover:bg-[#E63956] text-white font-bold text-xs shadow-md shadow-[#FF4D6D]/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>LOG IN TO YOUR ACCOUNT</span>
            <FiArrowRight />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-4 border-t border-amber-100 text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-[#FF4D6D] hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
