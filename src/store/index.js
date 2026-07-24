import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import orderReducer from './orderSlice.js';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        orders: orderReducer,
    },
});

export default store;
