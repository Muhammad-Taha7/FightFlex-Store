import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAuthToken } from './authSlice';

const API_URL = 'http://localhost:5000/api/orders';

// Fetch user's orders
export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUserOrders',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            setAuthToken(auth.token);
            const response = await axios.get(API_URL, { withCredentials: true });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch orders.';
            return rejectWithValue(message);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearOrderError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
