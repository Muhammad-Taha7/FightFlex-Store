import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword, resetPassword, clearAuthStatus } from '../../store/authSlice';
import { Mail, Lock, ShieldCheck, AlertCircle, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import SuccessModal from '../Components/SuccessModal';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthStatus());
  }, [dispatch]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!email) return;
    dispatch(clearAuthStatus());
    const result = await dispatch(forgotPassword({ email }));
    if (forgotPassword.fulfilled.match(result)) {
      setStep(2);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!otp || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    dispatch(clearAuthStatus());
    const result = await dispatch(resetPassword({ email, otp, newPassword }));
    if (resetPassword.fulfilled.match(result)) {
      setShowSuccess(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/client-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-50 via-gray-100/50 to-blue-50/20 flex items-center justify-center p-5">
      <SuccessModal 
        isOpen={showSuccess} 
        onClose={handleSuccessClose} 
        title="Password Reset!" 
        message="Your password has been successfully reset. You can now sign in with your new credentials." 
      />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black tracking-wider text-gray-900 uppercase no-underline inline-block mb-2">
            <span className="text-blue-600">Fight</span>Flex
          </Link>
          <h2 className="text-xl font-black text-gray-900">Reset Password</h2>
          <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase mt-1">
            Secure Account Recovery
          </p>
        </div>

        <div className="bg-white border border-gray-200 shadow-xl rounded-3xl p-8 sm:p-10">
          {(error || localError) && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error || localError}</span>
            </div>
          )}

          {successMessage && step === 2 && !showSuccess && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <p className="text-sm text-gray-600 font-medium mb-4">
                Enter your registered email address and we'll send you a 6-digit verification code to reset your password.
              </p>
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
                  className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-blue-700 disabled:opacity-50 cursor-pointer border-none shadow-md shadow-blue-600/20">
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                  <KeyRound className="w-3.5 h-3.5 text-gray-500" /> 6-Digit Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                  maxLength={6}
                  className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-center text-2xl tracking-[0.5em] text-blue-600 placeholder-gray-300 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 font-black"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                  <Lock className="w-3.5 h-3.5 text-gray-500" /> New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 font-semibold"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-500" /> Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-blue-700 disabled:opacity-50 cursor-pointer border-none shadow-md shadow-blue-600/20">
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-gray-500 text-sm mt-8 pt-6 border-t border-gray-100 font-medium">
            Remembered your password?{' '}
            <Link to="/client-login" className="text-blue-600 font-bold hover:text-blue-700 no-underline transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
