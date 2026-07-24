import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendOtp, clearAuthStatus, clearOtpState } from '../../store/authSlice';
import { Mail, CheckCircle, AlertCircle, X, ShieldCheck, RefreshCw } from 'lucide-react';

const OtpModal = ({ email, onClose }) => {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    // Only numeric input
    if (value && !/^\d+$/.test(value)) return;

    const newDigits = [...otpDigits];

    // Handle paste of 6 digits
    if (value.length > 1) {
      const pastedDigits = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedDigits[i] || '';
      }
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pastedDigits.length, 5);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
      return;
    }

    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) return;

    await dispatch(verifyOtp({ email, otp: fullOtp }));
  };

  const handleResend = async () => {
    if (!canResend || loading) return;
    dispatch(clearAuthStatus());
    const result = await dispatch(resendOtp({ email }));
    if (resendOtp.fulfilled.match(result)) {
      setTimer(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    }
  };

  const isComplete = otpDigits.every((digit) => digit !== '');

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl w-full max-w-md p-6 sm:p-8 relative transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button onClick={() => { dispatch(clearOtpState()); if (onClose) onClose(); }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-transparent border-none p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4 text-blue-600">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-xl font-black text-gray-900">Verify Your Email</h2>
          <p className="text-gray-500 text-xs sm:text-sm font-medium mt-1">
            We have sent a 6-digit verification code to
          </p>
          <p className="text-blue-600 text-xs sm:text-sm font-bold mt-0.5 break-all">
            {email}
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-red-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-emerald-700 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* OTP Input Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex items-center justify-center gap-2 sm:gap-2.5">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-extrabold text-gray-900 bg-gray-50 border rounded-xl outline-none transition-all duration-200 ${
                  digit ? 'border-blue-600 bg-white ring-2 ring-blue-100' : 'border-gray-300 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100'
                }`}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={!isComplete || loading}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 hover:bg-blue-700 disabled:opacity-50 cursor-pointer border-none shadow-md shadow-blue-600/20">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Verifying...</span>
              </div>
            ) : (
              'Verify & Proceed'
            )}
          </button>
        </form>

        {/* Resend Section */}
        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <p className="text-gray-500 text-xs font-medium">
            Didn't receive the code?{' '}
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-blue-600 font-bold hover:text-blue-700 underline bg-transparent border-none cursor-pointer transition-colors inline-flex items-center gap-1 ml-1">
                <RefreshCw size={12} /> Resend Code
              </button>
            ) : (
              <span className="text-gray-400 font-bold ml-1">
                Resend in <span className="text-blue-600 font-extrabold">{timer}s</span>
              </span>
            )}
          </p>
        </div>

      </div>
    </div>
  );
};

export default OtpModal;
