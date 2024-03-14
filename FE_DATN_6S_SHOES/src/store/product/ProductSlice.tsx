

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: '',
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        searchProduct: (state, action) => {
            state.products = action.payload;
        },
        clearProductSearch: (state) => {
            state.products = ''
        }
    },
});
export default productSlice.reducer;
export const { searchProduct, clearProductSearch } = productSlice.actions
