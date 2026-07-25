import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAdmin, clearAuthStatus } from "../../store/authSlice";
import {
  Lock,
  User,
  ShieldCheck,
  AlertCircle,
  Dumbbell,
  ArrowRight,
} from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/run/Dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearAuthStatus());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) return;

    const result = await dispatch(loginAdmin({ username, password }));

    if (loginAdmin.fulfilled.match(result)) {
      navigate("/run/Dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-black flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl shadow-2xl p-6 sm:p-12">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black font-mono uppercase">
            FIGHTFLEX
          </h1>

          <p className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">
            Admin Authentication
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-black bg-black/5 p-4 text-black">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-black" />
            <span className="text-xs sm:text-sm font-bold">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Username */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black">
              <User className="w-4 h-4 text-black" />
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-5 py-3.5 sm:py-4 text-sm text-black placeholder-gray-400 outline-none transition-all duration-200 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10 font-semibold"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black">
              <Lock className="w-4 h-4 text-black" />
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-5 py-3.5 sm:py-4 text-sm text-black placeholder-gray-400 outline-none transition-all duration-200 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10 font-semibold"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-black py-4 text-sm font-bold text-white transition-all duration-200 hover:bg-gray-800 active:scale-[0.99] disabled:opacity-50 shadow-lg"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;