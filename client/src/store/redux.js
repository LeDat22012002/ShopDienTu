// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSlice';
import productsSlice from './products/productsSlice';
import userSlice from './user/userSlice';
import cartSlice from './cart/cartSlice';
import buidlPcSlice from './buildPc/buidlPcSlice';
import storage from 'redux-persist/lib/storage';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

// Config chung
const commonConfig = {
    storage,
};
const userConfig = {
    ...commonConfig,
    key: 'shop/user',
    whitelist: ['isLoggedIn', 'token', 'current'],
};
// Config cho cart
const cartConfig = {
    ...commonConfig,
    key: 'shop/cart',
    whitelist: ['cartItems', 'productsSelected'], // tuỳ thuộc vào state bên trong cartSlice
};
const buildPCConfig = {
    ...commonConfig,
    key: 'shop/buildPC',
    whitelist: ['selectedParts'],
};

export const store = configureStore({
    reducer: {
        app: appSlice,
        products: productsSlice,
        user: persistReducer(userConfig, userSlice),
        cart: persistReducer(cartConfig, cartSlice),
        buildPC: persistReducer(buildPCConfig, buidlPcSlice),
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export const persistor = persistStore(store);
