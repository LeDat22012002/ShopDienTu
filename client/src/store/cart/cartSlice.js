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
    isSuccessOrder: false,
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
                // if (itemCart.count <= cartItem.countInstock) {
                //     itemOrder.amount += orderItem?.amount;
                //     state.isSuccessOrder = true;
                // }
                itemCart.count += cartItem.count;
            } else {
                state.cartItems.push(cartItem);
            }
        },
        removeCart: (state, action) => {
            const { pid } = action.payload;
            const itemCart = state?.cartItems?.filter(
                (item) => item?.product !== pid
            );
            itemCart.cartItems = itemCart;
            // const itemOrderSelected = state?.orderItemsSelected?.filter((item) => item?.product !== idProduct);
            // console.log(' removeOrderProduct', { idProduct, itemOrder });
            // state.orderItems = itemOrder;
            // state.orderItemsSelected = itemOrderSelected;
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

// export const {} = productsSlice.actions
export const { addCart } = cartSlice.actions;
export default cartSlice.reducer;
