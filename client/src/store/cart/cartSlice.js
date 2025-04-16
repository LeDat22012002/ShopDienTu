import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: [],
    productsSelected: [],
    userReceives: {},
    paymentMethod: '',
    itemsPrice: 0,
    total: 0,
    user: '',
    isPaid: false,
    paidAt: '',
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
            if (itemCart && itemCart.count < itemCart.quantity)
                itemCart.count++;
        },
        decrease: (state, action) => {
            const { pid, sku } = action.payload;
            const itemCart = state.cartItems.find(
                (item) => item.product === pid && item.sku === sku
            );
            if (itemCart && itemCart.count > 1) itemCart.count--;
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
            state.productsSelected = cartSelected;
        },
    },
    // // Code logic sử lí Async Action
    // extraReducers: (builder) => {
    //     //Bắt đầu thực hiện action (Promise pending)
    //     builder.addCase(getNewProduct.pending, (state) => {
    //         //Bật trạng thái Loading
    //         state.isLoading = true;
    //     });

    //     // Khi thực hiện Action thành công ( Promise Fulfilled)
    //     builder.addCase(getNewProduct.fulfilled, (state, action) => {
    //         // console.log(action)
    //         //Tắt trạng thái loading , lưu thông tin vào store
    //         (state.isLoading = false), (state.newProducts = action.payload);
    //     });

    //     // Khi thực hiện action thất bại ( Promise rejected)
    //     builder.addCase(getNewProduct.rejected, (state, action) => {
    //         // Tắt trạng thái loading , lưu thông báo lỗi vào store
    //         (state.isLoading = false),
    //             (state.errorMessage = action.payload.message);
    //     });
    // },
});

export const {
    addCart,
    increase,
    decrease,
    removeCart,
    removeAllProductCart,
    selectedCart,
    hidePreview,
} = cartSlice.actions;
export default cartSlice.reducer;
