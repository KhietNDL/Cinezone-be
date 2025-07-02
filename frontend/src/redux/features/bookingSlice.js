
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
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    setSelectedDay: (state, action) => {
      state.selectedDay = action.payload;
    },
    setSelectedVersion: (state, action) => {
      state.selectedVersion = action.payload;
    },
    setSelectedTime: (state, action) => {
      state.selectedTime = action.payload;
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
} = bookingSlice.actions;

export default bookingSlice.reducer;