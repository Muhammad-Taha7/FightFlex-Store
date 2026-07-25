import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

// Helper to set Axios auth token header
export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

const storedToken = localStorage.getItem('fightflex_token');
const storedUser = localStorage.getItem('fightflex_user');

if (storedToken) {
    setAuthToken(storedToken);
}

const initialState = {
    token: storedToken || null,
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedToken,
    requiresOtp: false,
    otpEmail: null,
    loading: false,
    error: null,
    successMessage: null,
};

// Admin Login
export const loginAdmin = createAsyncThunk(
    'auth/loginAdmin',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password }, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Invalid credentials.';
            return rejectWithValue(message);
        }
    }
);

// Client User Registration
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ username, email, password, address, profileImage }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/register`, {
                username, email, password, address, profileImage
            }, { withCredentials: true });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed.';
            return rejectWithValue(message);
        }
    }
);

// Client User Login (email + password)
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/client-login`, { email, password }, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Invalid credentials.';
            return rejectWithValue(message);
        }
    }
);

// Verify OTP Async Thunk
export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/verify-otp`, { email, otp }, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Verification failed.';
            return rejectWithValue(message);
        }
    }
);

// Resend OTP Async Thunk
export const resendOtp = createAsyncThunk(
    'auth/resendOtp',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/resend-otp`, { email }, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to resend OTP.';
            return rejectWithValue(message);
        }
    }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to send password reset email.';
            return rejectWithValue(message);
        }
    }
);

// Reset Password
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ email, otp, newPassword }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/reset-password`, { email, otp, newPassword });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to reset password.';
            return rejectWithValue(message);
        }
    }
);

// Google Login Async Thunk
export const loginWithGoogle = createAsyncThunk(
    'auth/loginWithGoogle',
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/google-login`, { token }, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Google Login failed.';
            return rejectWithValue(message);
        }
    }
);

// Fetch Current User Profile
export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            if (!auth.token) return rejectWithValue('No token');
            setAuthToken(auth.token);
            const response = await axios.get(`${API_URL}/me`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch user session.';
            return rejectWithValue(message);
        }
    }
);

// Update Profile
export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (profileData, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            setAuthToken(auth.token);
            const response = await axios.put(`${API_URL}/update-profile`, profileData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update profile.';
            return rejectWithValue(message);
        }
    }
);

// Update Credentials
export const updateCredentials = createAsyncThunk(
    'auth/updateCredentials',
    async (credentialsData, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            setAuthToken(auth.token);
            const response = await axios.put(`${API_URL}/change-credentials`, credentialsData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update credentials.';
            return rejectWithValue(message);
        }
    }
);

// Logout
export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { getState }) => {
        try {
            const { auth } = getState();
            if (auth.token) {
                setAuthToken(auth.token);
                await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
            }
            return true;
        } catch (error) {
            return true;
        }
    }
);

export const logoutAdmin = logoutUser;

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAuthStatus: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        clearOtpState: (state) => {
            state.requiresOtp = false;
            state.otpEmail = null;
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Admin Login
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.error = null;
                localStorage.setItem('fightflex_token', action.payload.token);
                localStorage.setItem('fightflex_user', JSON.stringify(action.payload.user));
                setAuthToken(action.payload.token);
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
                state.error = action.payload;
            })

            // Client Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.requiresOtp) {
                    state.requiresOtp = true;
                    state.otpEmail = action.payload.email;
                    state.successMessage = action.payload.message || 'OTP verification code sent!';
                }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Client Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.requiresOtp) {
                    state.requiresOtp = true;
                    state.otpEmail = action.payload.email;
                    state.successMessage = action.payload.message;
                } else {
                    state.isAuthenticated = true;
                    state.token = action.payload.token;
                    state.user = action.payload.user;
                    state.error = null;
                    localStorage.setItem('fightflex_token', action.payload.token);
                    localStorage.setItem('fightflex_user', JSON.stringify(action.payload.user));
                    setAuthToken(action.payload.token);
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Verify OTP
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.requiresOtp = false;
                state.otpEmail = null;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.error = null;
                state.successMessage = action.payload.message;
                localStorage.setItem('fightflex_token', action.payload.token);
                localStorage.setItem('fightflex_user', JSON.stringify(action.payload.user));
                setAuthToken(action.payload.token);
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Resend OTP
            .addCase(resendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resendOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(resendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
                state.otpEmail = action.meta.arg.email; // Store email for OTP step
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
                state.otpEmail = null;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Google Login
            .addCase(loginWithGoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.error = null;
                state.successMessage = action.payload.message;
                localStorage.setItem('fightflex_token', action.payload.token);
                localStorage.setItem('fightflex_user', JSON.stringify(action.payload.user));
                setAuthToken(action.payload.token);
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch User
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                localStorage.setItem('fightflex_user', JSON.stringify(action.payload.user));
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
                localStorage.removeItem('fightflex_token');
                localStorage.removeItem('fightflex_user');
                setAuthToken(null);
            })

            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.successMessage = action.payload.message || 'Profile updated successfully!';
                localStorage.setItem('fightflex_user', JSON.stringify(action.payload.user));
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
                state.requiresOtp = false;
                state.otpEmail = null;
                state.loading = false;
                state.error = null;
                state.successMessage = null;
                localStorage.removeItem('fightflex_token');
                localStorage.removeItem('fightflex_user');
                setAuthToken(null);
            });
    },
});

export const { clearAuthStatus, clearOtpState } = authSlice.actions;
export default authSlice.reducer;
