import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import bookingReducer from "./features/bookingSlice";

const rootReducer = combineReducers({
  user: userReducer,
  booking: bookingReducer,
  
});
export default rootReducer;
