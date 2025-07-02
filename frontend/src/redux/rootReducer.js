import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import bookingReducer from './features/bookingSlice';
import memberReducer from './features/memberSlice';

const rootReducer = combineReducers({
  user: userReducer,
  booking: bookingReducer,
  member: memberReducer,
});
export default rootReducer;
