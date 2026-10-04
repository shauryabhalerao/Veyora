import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      await signup({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password
      });

      addToast('Account created successfully! Welcome to Veyora.', 'success');
      navigate('/account', { replace: true });
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white p-8 md:p-10 rounded-2xl border border-[#E8E1D5] shadow-soft space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6D46]">
            Join Veyora Club
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
            Create Your Account
          </h1>
          <p className="text-xs text-[#78716C]">
            Unlock exclusive rewards, personalized AI styling, and priority order tracking.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Eleanor Vance"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-1.5">
              Email Address *
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
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-1.5">
              Phone Number <span className="text-[10px] font-normal text-[#78716C]">(Optional)</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917] transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#1C1917] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#8C6D46] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Create Account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-[#E8E1D5] text-center text-xs text-[#78716C]">
          Already have a Veyora account?{' '}
          <Link to="/login" className="font-bold text-[#1C1917] hover:text-[#8C6D46] transition-colors underline">
            Log In
          </Link>
        </div>

      </div>
    </div>
  );
};
