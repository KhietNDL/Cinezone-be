
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedMovie: null,
    selectedDay: null,
    selectedVersion: null,
    selectedTime: null,
    room: '',
    showtimeId: '',
    selectedSeats: [],
    seatData: [],
    totalPrice: 0,
    movie: null,
    version: '',
    time: '',
    memberInfo: null,
    paymentMethod: '',
    amountPaid: 0,
    promotionTitle: '',
    isConfirmed: false,
    discount: null,
    usedPoints: 0,
    bookingId: '',
    paymentId: null,
    stripeClientSecret: null,
    visaResponse: null,
};

const sellingSlice = createSlice({
    name: 'selling',
    initialState,
    reducers: {
        setSelectedMovie: (state, action) => {
            state.selectedMovie = action.payload;
            state.selectedDay = null;
            state.selectedVersion = null;
            state.selectedTime = null;
            state.selectedSeats = [];
            state.seatData = [];
            state.totalPrice = 0;
        },
        setSelectedDay: (state, action) => {
            state.selectedDay = action.payload;
            state.selectedVersion = null;
            state.selectedTime = null;
            state.selectedSeats = [];
            state.seatData = [];
            state.totalPrice = 0;
        },
        setSelectedVersion: (state, action) => {
            state.selectedVersion = action.payload;
        },
        setSelectedTime: (state, action) => {
            state.selectedTime = action.payload;
            // Reset thông tin ghế mỗi khi đổi giờ chiếu
            state.selectedSeats = [];
            state.seatData = [];
            state.totalPrice = 0;
        },
        setRoom: (state, action) => {
            state.room = action.payload;
        },
        setShowtimeId: (state, action) => {
            state.showtimeId = action.payload;
        },
        setSelectedSeats: (state, action) => {
            state.selectedSeats = action.payload;
        },
        setSeatData: (state, action) => {
            state.seatData = action.payload;
        },
        setTotalPrice: (state, action) => {
            state.totalPrice = action.payload;
        },
        setCompleteBooking: (state, action) => {
            return { ...state, ...action.payload };
        },
        setPaymentId(state, action) {
            state.paymentId = action.payload;
        },
        setStripeClientSecret(state, action) {
            state.stripeClientSecret = action.payload;
        },
        setVisaResponse(state, action) {
            state.visaResponse = action.payload;
        },
        resetBooking: () => initialState,
    },
});

export const {
    setSelectedMovie,
    setSelectedDay,
    setSelectedVersion,
    setSelectedTime,
    setRoom,
    setShowtimeId,
    setSelectedSeats,
    setSeatData,
    setTotalPrice,
    setCompleteBooking,
    resetBooking,
    setPaymentId,
    setStripeClientSecret,
    setVisaResponse
} = sellingSlice.actions;

export default sellingSlice.reducer;
