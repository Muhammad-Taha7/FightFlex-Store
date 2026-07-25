import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
    try {
        const storedCart = localStorage.getItem('fightflex_cart');
        return storedCart ? JSON.parse(storedCart) : { items: [], totalAmount: 0, totalQuantity: 0 };
    } catch (e) {
        console.error("Failed to load cart from storage", e);
        return { items: [], totalAmount: 0, totalQuantity: 0 };
    }
};

const initialState = loadCartFromStorage();

const saveCartToStorage = (state) => {
    try {
        localStorage.setItem('fightflex_cart', JSON.stringify(state));
    } catch (e) {
        console.error("Failed to save cart to storage", e);
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find(
                item => item._id === newItem._id && item.size === newItem.size && item.color === newItem.color
            );

            if (!existingItem) {
                state.items.push({
                    _id: newItem._id,
                    title: newItem.title,
                    price: newItem.price,
                    image: newItem.image,
                    size: newItem.size || '',
                    color: newItem.color || '',
                    quantity: newItem.quantity || 1,
                });
                state.totalQuantity += (newItem.quantity || 1);
            } else {
                existingItem.quantity += (newItem.quantity || 1);
                state.totalQuantity += (newItem.quantity || 1);
            }
            state.totalAmount = state.items.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);
            saveCartToStorage(state);
        },
        removeFromCart(state, action) {
            const idToRemove = action.payload._id;
            const sizeToRemove = action.payload.size;
            const colorToRemove = action.payload.color;

            const existingItem = state.items.find(
                item => item._id === idToRemove && item.size === sizeToRemove && item.color === colorToRemove
            );

            if (existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.items = state.items.filter(
                    item => !(item._id === idToRemove && item.size === sizeToRemove && item.color === colorToRemove)
                );
                state.totalAmount = state.items.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);
                saveCartToStorage(state);
            }
        },
        increaseQuantity(state, action) {
            const { _id, size, color } = action.payload;
            const existingItem = state.items.find(
                item => item._id === _id && item.size === size && item.color === color
            );
            if (existingItem) {
                existingItem.quantity++;
                state.totalQuantity++;
                state.totalAmount = state.items.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);
                saveCartToStorage(state);
            }
        },
        decreaseQuantity(state, action) {
            const { _id, size, color } = action.payload;
            const existingItem = state.items.find(
                item => item._id === _id && item.size === size && item.color === color
            );
            if (existingItem) {
                if (existingItem.quantity === 1) {
                    state.items = state.items.filter(
                        item => !(item._id === _id && item.size === size && item.color === color)
                    );
                } else {
                    existingItem.quantity--;
                }
                state.totalQuantity--;
                state.totalAmount = state.items.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);
                saveCartToStorage(state);
            }
        },
        clearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
            saveCartToStorage(state);
        }
    }
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
