import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: [],
    orderProductId: null,
    totalAmount: 0,
    lastOrder: null,
};

const comboSlice = createSlice({
    name: "combo",
    initialState,
    reducers: {
          setComboCart: (state, action) => {
            state.cart = action.payload;
        },
        clearComboCart: (state) => {
            state.cart = [];
            state.orderProductId = null;
            state.totalAmount = 0;
        },
        setLastComboOrder: (state, action) => {
            state.lastOrder = action.payload;
        },
        setOrderInfo: (state, action) => {
            state.orderProductId = action.payload.orderProductId;
            state.totalAmount = action.payload.totalAmount;
        },
        clearOrderInfo: (state) => {
            state.orderProductId = null;
            state.totalAmount = 0;
        },
    },
});

export const { setComboCart, clearComboCart, setLastComboOrder, setOrderInfo, clearOrderInfo } = comboSlice.actions;
export default comboSlice.reducer;