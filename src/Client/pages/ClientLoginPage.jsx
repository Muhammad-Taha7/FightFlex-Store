import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearAuthStatus } from '../../store/authSlice';
import { Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff, LogIn } from 'lucide-react';
import OtpModal from '../../Client/Components/OtpModal';
import SuccessModal from '../Components/SuccessModal';
import GoogleAuthButton from '../Components/GoogleAuthButton';

const ClientLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, requiresOtp, otpEmail, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && isSubmitting) {
      setShowSuccess(true);
      setIsSubmitting(false);
    } else if (isAuthenticated && !isSubmitting && !showSuccess) {
      navigate('/');
    }
  }, [isAuthenticated, isSubmitting, navigate, showSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    dispatch(clearAuthStatus());
    await dispatch(loginUser({ email, password }));
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-50 via-gray-100/50 to-gray-50/20 flex items-center justify-center p-5">
      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccess} 
        onClose={handleSuccessClose} 
        title="Sign In Success!" 
        message="Welcome back to FightFlex. You have successfully authenticated." 
      />

      {/* 6-Digit OTP Verification Modal Dialog */}
      {requiresOtp && otpEmail && (
        <OtpModal email={otpEmail} />
      )}

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black tracking-wider text-gray-900 uppercase no-underline inline-block mb-2">
            <span className="text-gray-900">Fight</span>Flex
          </Link>
          <h2 className="text-xl font-black text-gray-900">Sign In to Your Account</h2>
          <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase mt-1">
            Welcome Back
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 shadow-xl rounded-3xl p-8 sm:p-10">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Address */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                <Mail className="w-3.5 h-3.5 text-gray-500" /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-100 font-semibold"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                <Lock className="w-3.5 h-3.5 text-gray-500" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3.5 pr-12 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-100 font-semibold"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer bg-transparent border-none p-1 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <Link to="/forgot-password" className="text-xs font-bold text-gray-900 hover:text-black transition-colors">
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-black disabled:opacity-50 cursor-pointer border-none shadow-md shadow-gray-900/20">
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <span className="border-b border-gray-200 w-1/5 lg:w-1/4"></span>
            <span className="text-xs text-center text-gray-500 uppercase font-bold tracking-wider">or continue with</span>
            <span className="border-b border-gray-200 w-1/5 lg:w-1/4"></span>
          </div>
          
          <GoogleAuthButton 
            onSuccess={() => setIsSubmitting(true)} 
          />

          {/* Link to Signup */}
          <p className="text-center text-gray-500 text-sm mt-8 pt-6 border-t border-gray-100 font-medium">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-gray-900 font-bold hover:text-black no-underline transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientLoginPage;
