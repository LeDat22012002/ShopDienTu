import { createSlice } from '@reduxjs/toolkit';
import { getNewProduct } from './asyncActions';

export const productsSlice = createSlice({
    name: 'product',
    initialState: {
        newProducts: null,
        errorMessage: '',
    },
    reducers: {},
    // Code logic sử lí Async Action
    extraReducers: (builder) => {
        //Bắt đầu thực hiện action (Promise pending)
        builder.addCase(getNewProduct.pending, (state) => {
            //Bật trạng thái Loading
            state.isLoading = true;
        });

        // Khi thực hiện Action thành công ( Promise Fulfilled)
        builder.addCase(getNewProduct.fulfilled, (state, action) => {
            // console.log(action)
            //Tắt trạng thái loading , lưu thông tin vào store
            (state.isLoading = false), (state.newProducts = action.payload);
        });

        // Khi thực hiện action thất bại ( Promise rejected)
        builder.addCase(getNewProduct.rejected, (state, action) => {
            // Tắt trạng thái loading , lưu thông báo lỗi vào store
            (state.isLoading = false),
                (state.errorMessage = action.payload.message);
        });
    },
});

// export const {} = productsSlice.actions

export default productsSlice.reducer;
