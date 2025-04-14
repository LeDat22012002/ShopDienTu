// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSlice';
import productsSlice from './products/productsSlice';
import userSlice from './user/userSlice';
import cartSlice from './cart/cartSlice';
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

const commonConfig = {
    key: 'shop/user',
    storage,
};
const userConfig = {
    ...commonConfig,
    whitelist: ['isLoggedIn', 'token', 'current'],
};

export const store = configureStore({
    reducer: {
        app: appSlice,
        products: productsSlice,
        user: persistReducer(userConfig, userSlice),
        cart: cartSlice,
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
