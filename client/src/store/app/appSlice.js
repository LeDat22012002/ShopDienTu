import { createSlice } from '@reduxjs/toolkit';
import * as actions from './asyncAction';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        categories: null,
        isLoading: false,
        isShowModal: false,
        modalChildren: null,
    },
    reducers: {
        showModal: (state, action) => {
            (state.isShowModal = action.payload.isShowModal),
                (state.modalChildren = action.payload.modalChildren);
        },
    },
    // Code logic sử lí Async Action
    extraReducers: (builder) => {
        //Bắt đầu thực hiện action (Promise pending)
        builder.addCase(actions.getCategories.pending, (state) => {
            //Bật trạng thái Loading
            state.isLoading = true;
        });

        // Khi thực hiện Action thành công ( Promise Fulfilled)
        builder.addCase(actions.getCategories.fulfilled, (state, action) => {
            // console.log(action)
            //Tắt trạng thái loading , lưu thông tin vào store
            (state.isLoading = false), (state.categories = action.payload);
        });

        // Khi thực hiện action thất bại ( Promise rejected)
        builder.addCase(actions.getCategories.rejected, (state, action) => {
            // Tắt trạng thái loading , lưu thông báo lỗi vào store
            (state.isLoading = false),
                (state.errorMessage = action.payload.message);
        });
    },
});

export const { showModal } = appSlice.actions;

export default appSlice.reducer;
