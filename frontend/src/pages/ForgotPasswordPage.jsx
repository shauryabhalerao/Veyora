import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl border border-[#E8E1D5] shadow-soft space-y-6">
        
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6D46]">
            Account Recovery
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
            Reset Password
          </h1>
          <p className="text-xs text-[#78716C]">
            Enter your account email address and we will provide instructions to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-[#F9ECE6] border border-[#E8E1D5] rounded-xl text-center space-y-3">
            <CheckCircle className="w-8 h-8 text-[#8C6D46] mx-auto" />
            <h3 className="font-serif font-bold text-lg text-[#1C1917]">Request Received</h3>
            <p className="text-xs text-[#78716C]">
              Password reset requests for <strong>{email}</strong> have been logged. Please contact Veyora support or check with your system administrator for assistance.
            </p>
            <div className="pt-2">
              <Link to="/login" className="inline-block px-4 py-2 bg-[#1C1917] text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
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

            <button
              type="submit"
              className="w-full py-3 bg-[#1C1917] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#8C6D46] transition-all flex items-center justify-center gap-2"
            >
              Send Reset Link <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[#E8E1D5] text-center text-xs text-[#78716C]">
          Remember your password?{' '}
          <Link to="/login" className="font-bold text-[#1C1917] hover:text-[#8C6D46] transition-colors underline">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};
