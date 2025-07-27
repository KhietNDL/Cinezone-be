import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: [],
    orderProductId: null,
    totalAmount: 0,
    lastOrder: null,
    paymentId: null,
    stripeClientSecret: null,
    comboVisaResponse: null,
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
        setPaymentId(state, action) {
            state.paymentId = action.payload;
        },
        setStripeClientSecret(state, action) {
            state.stripeClientSecret = action.payload;
        },
        setComboVisaResponse(state, action) {
            state.comboVisaResponse = action.payload;
        },
        clearOrderInfo: (state) => {
            state.orderProductId = null;
            state.totalAmount = 0;
        },
        resetCart: () => initialState,
    },
});

export const {
    setComboCart,
    clearComboCart,
    setLastComboOrder,
    setOrderInfo,
    clearOrderInfo,
    setPaymentId,
    setStripeClientSecret,
    setComboVisaResponse,
    resetCart
} = comboSlice.actions;

export default comboSlice.reducer;