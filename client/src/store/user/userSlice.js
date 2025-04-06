import { createSlice } from '@reduxjs/toolkit';
import * as actions from './asyncActions';
export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null,
        isLoading: false,
        mess: '',
    },
    reducers: {
        login: (state, action) => {
            // console.log(action);
            (state.isLoggedIn = action.payload.isLoggedIn),
                // (state.current = action.payload.userData);
                (state.token = action.payload.token);
        },

        logout: (state, action) => {
            // console.log(action);
            state.isLoggedIn = false;
            state.current = null;
            state.isLoading = false;
            state.mess = '';
            state.token = null;
        },
        clearMessage: (state) => {
            state.mess = '';
        },
    },
    //Code logic sử lí Async Action
    extraReducers: (builder) => {
        //Bắt đầu thực hiện action (Promise pending)
        builder.addCase(actions.getCurent.pending, (state) => {
            //Bật trạng thái Loading
            state.isLoading = true;
        });

        // Khi thực hiện Action thành công ( Promise Fulfilled)
        builder.addCase(actions.getCurent.fulfilled, (state, action) => {
            // console.log(action)
            //Tắt trạng thái loading , lưu thông tin vào store
            state.isLoading = false;
            state.current = action.payload;
            state.isLoggedIn = true;
        });

        // Khi thực hiện action thất bại ( Promise rejected)
        builder.addCase(actions.getCurent.rejected, (state, action) => {
            // Tắt trạng thái loading , lưu thông báo lỗi vào store
            state.isLoading = false;
            state.current = null;
            state.isLoggedIn = false;
            state.token = null;
            state.mess = 'Login session has expired. Please log in again!';
        });
    },
});

export const { login, logout, clearMessage } = userSlice.actions;

export default userSlice.reducer;
