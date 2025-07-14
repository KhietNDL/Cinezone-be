import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import bookingReducer from './features/bookingSlice';
import memberReducer from './features/memberSlice';
import sellingReducer from './features/sellingSlice'
import comboReducer from './features/comboSlice';

const rootReducer = combineReducers({
  user: userReducer,
  booking: bookingReducer,
  member: memberReducer,
  selling: sellingReducer,
  combo: comboReducer
});
export default rootReducer;
