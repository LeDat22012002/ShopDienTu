import { createAsyncThunk } from '@reduxjs/toolkit';
import * as apis from '../../apis';

export const getCurent = createAsyncThunk(
    'user/current',
    async (data, { rejectWithValue }) => {
        const response = await apis.apiGetUserDetails();
        // console.log(response);
        if (!response.success) return rejectWithValue(response);
        return response.rs;
    }
);
