import { createSlice } from "@reduxjs/toolkit";

const initialState = {  
  selectedSeats: [],
  seatIds: [],
  setProducts: [],
  orderProductsId: [],
  bookingId: [],
  calculatedTotalPrice: 0,
  selectedRoom: "",
  selectedDate: "",
  selectedTime: "",
  selectedShowtimeId: "",
  seatQuantity: 0,
  seatsData: [],
  finalTotalPrice:0,
  movie: null,
  product: null, 
  productDetail:null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setSelectedSeats(state, action) {
      state.selectedSeats = action.payload;
    },
    setSeatIds(state, action) {
      state.seatIds = action.payload;
    },
    setCalculatedTotalPrice(state, action) {
      state.calculatedTotalPrice = action.payload;
    },
    setSelectedRoom(state, action) {
      state.selectedRoom = action.payload;
    },
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
    setSelectedTime(state, action) {
      state.selectedTime = action.payload;
    },
    setSelectedShowtimeId(state, action) {
      state.selectedShowtimeId = action.payload;
    },
    setSeatsData(state, action) {
      state.seatsData = action.payload;
    },
    setSeatQuantity(state, action) {
      state.seatQuantity = action.payload;
    },
    setMovie(state, action) {
      state.movie = action.payload;
    },
     setProduct(state, action) {
      state.product = action.payload;
    },

    setFinalTotalPrice(state, action) {
      state.finalTotalPrice = action.payload; 
    },
    setProduct(state, action) {
      state.product = action.payload;
    },
    setBookingId(state, action) {
      state.bookingId = action.payload;
    } ,

    setOrderProductsId(state, action) {
      state.orderProductsId = action.payload;
    } ,
     setProductDetail(state, action) {
      state.productDetail = action.payload;
    },

    resetBooking(state) {
      Object.assign(state, initialState);
    },
     
  },
});

export const {
  setSelectedSeats,
  setSeatIds,
  setCalculatedTotalPrice,
  setSelectedRoom,
  setSelectedDate,
  setSelectedTime,
  setSelectedShowtimeId,
  setSeatsData,
  setSeatQuantity,
  setMovie,
  setProduct,
  setProductDetail,
  setBookingId,
  setOrderProductsId,
  setFinalTotalPrice,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
