import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import orderReducer from './orderSlice.js';
import cartReducer from './cartSlice.js';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        orders: orderReducer,
        cart: cartReducer,
    },
});

export default store;
