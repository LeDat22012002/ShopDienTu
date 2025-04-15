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
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addCart: (state, action) => {
            const { cartItem } = action.payload;
            const itemCart = state?.cartItems?.find(
                (item) => item?.product === cartItem.product
            );
            if (itemCart) {
                if (itemCart.count <= cartItem.quantity) {
                    itemCart.count += cartItem?.count;
                    state.isSuccessCart = true;
                }
            } else {
                state.cartItems.push(cartItem);
            }
        },

        increase: (state, action) => {
            const { pid } = action.payload;
            const itemCart = state?.cartItems?.find(
                (item) => item?.product === pid
            );
            const itemCartSelected = state?.productsSelected?.find(
                (item) => item?.product === pid
            );
            itemCart.count++;
            if (itemCartSelected) {
                itemCartSelected.count++;
            }
        },
        decrease: (state, action) => {
            const { pid } = action.payload;
            const itemCart = state?.cartItems?.find(
                (item) => item?.product === pid
            );
            const itemCartSelected = state?.productsSelected?.find(
                (item) => item?.product === pid
            );
            itemCart.count--;
            if (itemCartSelected) {
                itemCartSelected.amount--;
            }
        },
        removeCart: (state, action) => {
            const { pid } = action.payload;
            const itemCart = state?.cartItems?.filter(
                (item) => item?.product !== pid
            );
            const itemCartSelected = state?.productsSelected?.filter(
                (item) => item?.product !== pid
            );
            // console.log(' removeOrderProduct', { idProduct, itemOrder });
            state.cartItems = itemCart;
            state.productsSelected = itemCartSelected;
        },
        removeAllProductCart: (state, action) => {
            const { listChecked } = action.payload;
            const itemCarts = state?.cartItems?.filter(
                (item) => !listChecked.includes(item?.product)
            );
            const itemCartsSelected = state?.cartItems?.filter(
                (item) => !listChecked.includes(item?.product)
            );
            // console.log(' removeOrderProduct', { idProduct, itemOrder });
            state.cartItems = itemCarts;
            state.productsSelected = itemCartsSelected;
        },
        selectedCart: (state, action) => {
            const { listChecked } = action.payload;
            const cartSelected = [];
            state.cartItems.forEach((cart) => {
                if (listChecked.includes(cart.product)) {
                    cartSelected.push(cart);
                }
            });
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
} = cartSlice.actions;
export default cartSlice.reducer;
