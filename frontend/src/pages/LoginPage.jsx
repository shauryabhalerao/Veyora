import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      addToast('Welcome back to Veyora!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl border border-[#E8E1D5] shadow-soft space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6D46]">
            Welcome Back
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
            Log in to Veyora
          </h1>
          <p className="text-xs text-[#78716C]">
            Access your curated wishlist, order tracking, and VIP member benefits.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917] transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-[#8C6D46] hover:underline font-semibold"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#1C1917] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#8C6D46] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-[#E8E1D5] text-center text-xs text-[#78716C]">
          Don't have a Veyora account?{' '}
          <Link to="/signup" className="font-bold text-[#1C1917] hover:text-[#8C6D46] transition-colors underline">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};
