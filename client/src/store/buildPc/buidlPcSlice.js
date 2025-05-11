import { createSlice } from '@reduxjs/toolkit';

const builbPcSlice = createSlice({
    name: 'buildPC',
    initialState: {
        selectedParts: [],
    },
    reducers: {
        addPartToBuild: (state, action) => {
            const existing = state.selectedParts.find(
                (item) => item.category === action.payload.category
            );
            if (existing) {
                // Thay thế phần đã chọn theo category
                existing.product = action.payload.product;
            } else {
                state.selectedParts.push({
                    category: action.payload.category,
                    product: action.payload.product,
                });
            }
        },
        removePartFromBuild: (state, action) => {
            state.selectedParts = state.selectedParts.filter(
                (item) => item.category !== action.payload.category
            );
        },
        clearAllParts: (state) => {
            state.selectedParts = [];
        },
    },
});
export const { addPartToBuild, removePartFromBuild, clearAllParts } =
    builbPcSlice.actions;
export default builbPcSlice.reducer;
