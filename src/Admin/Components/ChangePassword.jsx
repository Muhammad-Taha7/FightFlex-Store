import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCredentials, clearAuthStatus } from '../../store/authSlice';
import { Lock, User, KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

const ChangePassword = () => {
    const dispatch = useDispatch();
    const { user, loading, error, successMessage } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        currentPassword: '',
        newUsername: user?.username || '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formError, setFormError] = useState('');

    // Clear auth alerts on mount & unmount
    useEffect(() => {
        dispatch(clearAuthStatus());
        return () => {
            dispatch(clearAuthStatus());
        };
    }, [dispatch]);

    // Keep form username synced if active user state updates externally
    useEffect(() => {
        if (user?.username) {
            setFormData((prev) => ({ ...prev, newUsername: user.username }));
        }
    }, [user?.username]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formError) setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        // Basic Front-end Validations
        if (!formData.currentPassword) {
            setFormError('Please enter your current password to authorize changes.');
            return;
        }

        if (formData.newPassword && formData.newPassword.length < 6) {
            setFormError('New password must be at least 6 characters long.');
            return;
        }

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setFormError('New password and confirmation password do not match.');
            return;
        }

        if (formData.newUsername === user?.username && !formData.newPassword) {
            setFormError('Please provide a new username or new password to update.');
            return;
        }

        // Build Dispatch Payload
        const payload = {
            currentPassword: formData.currentPassword,
        };

        if (formData.newUsername && formData.newUsername !== user?.username) {
            payload.newUsername = formData.newUsername;
        }

        if (formData.newPassword) {
            payload.newPassword = formData.newPassword;
        }

        // Dispatch Action
        const resultAction = await dispatch(updateCredentials(payload));

        if (updateCredentials.fulfilled.match(resultAction)) {
            // Reset sensitive form fields on success
            setFormData({
                currentPassword: '',
                newUsername: resultAction.payload?.user?.username || formData.newUsername,
                newPassword: '',
                confirmPassword: ''
            });
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header Banner */}
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-4">
                <div className="p-3 bg-slate-800 border border-slate-700/80 rounded-xl text-emerald-400">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Account Security & Credentials</h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Update your admin login username and password. Verification of your current password is required.
                    </p>
                </div>
            </div>

            {/* Success Alert */}
            {successMessage && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center gap-3 transition-all">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">{successMessage}</span>
                </div>
            )}

            {/* Error Alert */}
            {(error || formError) && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-3 transition-all">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">{formError || error}</span>
                </div>
            )}

            {/* Credentials Form Container */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Current User Info Badge */}
                    <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            Active Admin Username
                        </span>
                        <span className="text-white font-mono font-bold text-base px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg">
                            {user?.username || 'Admin'}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* New Username Input */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                                <User className="w-4 h-4 text-emerald-400" />
                                Admin Username
                            </label>
                            <input
                                type="text"
                                name="newUsername"
                                value={formData.newUsername}
                                onChange={handleChange}
                                placeholder="Enter new admin username"
                                className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                            />
                        </div>

                        {/* New Password Input */}
                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                                <KeyRound className="w-4 h-4 text-emerald-400" />
                                New Password (Optional)
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep current"
                                    className="w-full pl-4 pr-11 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword((prev) => !prev)}
                                    aria-label="Toggle new password visibility"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                                >
                                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                                <Lock className="w-4 h-4 text-emerald-400" />
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter new password"
                                    className="w-full pl-4 pr-11 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    aria-label="Toggle confirm password visibility"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-800" />

                    {/* Current Password Verification */}
                    <div className="space-y-2">
                        <label className="text-white text-sm font-semibold flex items-center gap-2">
                            <Lock className="w-4 h-4 text-emerald-400" />
                            Verify Current Password (Required)
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                required
                                placeholder="Enter current password to authorize changes"
                                className="w-full pl-4 pr-11 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword((prev) => !prev)}
                                aria-label="Toggle current password visibility"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                            >
                                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-slate-400">
                            Required to prevent unauthorized account changes.
                        </p>
                    </div>

                    {/* Action Submit Button */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-200 text-black font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5" />
                                    <span>Save Credentials</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;