import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: [],
    productsSelected: [],
    isSuccessCart: false,
    showPreview: false,
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addCart: (state, action) => {
            const { cartItem } = action.payload;
            const itemCart = state?.cartItems?.find(
                (item) =>
                    item?.product === cartItem.product &&
                    item?.sku === cartItem.sku
            );
            if (itemCart) {
                if (itemCart.count + cartItem.count <= cartItem.quantity) {
                    itemCart.count += cartItem?.count;
                    state.isSuccessCart = true;
                }
            } else {
                state.cartItems.push(cartItem);
                state.showPreview = true;
            }
            state.isSuccessCart = true;
        },

        hidePreview: (state) => {
            state.showPreview = false;
        },

        increase: (state, action) => {
            const { pid, sku } = action.payload;
            const itemCart = state.cartItems.find(
                (item) => item.product === pid && item.sku === sku
            );
            if (itemCart && itemCart.count < itemCart.quantity) {
                itemCart.count++;
                // Update the productsSelected if needed
                const selectedItem = state.productsSelected.find(
                    (item) => item.product === pid && item.sku === sku
                );
                if (selectedItem) selectedItem.count++;
            }
        },
        decrease: (state, action) => {
            const { pid, sku } = action.payload;
            const itemCart = state.cartItems.find(
                (item) => item.product === pid && item.sku === sku
            );
            if (itemCart && itemCart.count > 1) {
                itemCart.count--;
                // Update the productsSelected if needed
                const selectedItem = state.productsSelected.find(
                    (item) => item.product === pid && item.sku === sku
                );
                if (selectedItem) selectedItem.count--;
            }
        },
        removeCart: (state, action) => {
            const { pid, sku } = action.payload;
            state.cartItems = state.cartItems.filter(
                (item) => !(item.product === pid && item.sku === sku)
            );
            state.productsSelected = state.productsSelected.filter(
                (item) => !(item.product === pid && item.sku === sku)
            );
        },

        removeAllProductCart: (state, action) => {
            const { listChecked } = action.payload;
            state.cartItems = state.cartItems.filter(
                (item) => !listChecked.includes(`${item.product}_${item.sku}`)
            );
            state.productsSelected = state.productsSelected.filter(
                (item) => !listChecked.includes(`${item.product}_${item.sku}`)
            );
        },

        selectedCart: (state, action) => {
            const { listChecked } = action.payload;
            const cartSelected = state.cartItems.filter((cart) =>
                listChecked.includes(`${cart.product}_${cart.sku}`)
            );
            state.productsSelected = cartSelected.map((item) => ({
                ...item,
                count: item.count, // Ensure count is updated
            }));
        },

        resetCart: (state) => {
            return { ...initialState };
        },
    },
});

export const {
    addCart,
    increase,
    decrease,
    removeCart,
    removeAllProductCart,
    selectedCart,
    hidePreview,
    resetCart,
} = cartSlice.actions;
export default cartSlice.reducer;
