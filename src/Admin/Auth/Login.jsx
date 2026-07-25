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
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 sm:p-12">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-4xl font-black tracking-tight text-white font-mono">
            FIGHTFLEX
          </h1>

          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400 font-semibold">
            Admin Authentication
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <User className="w-4 h-4 text-slate-400" />
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-gray-800 focus:ring-2 focus:ring-gray-800/20 font-semibold"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Lock className="w-4 h-4 text-slate-400" />
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-gray-800 focus:ring-2 focus:ring-gray-800/20 font-semibold"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gray-900 py-4 text-sm font-bold text-white transition-all duration-200 hover:bg-gray-800 disabled:opacity-50 shadow-lg shadow-gray-900/20"
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