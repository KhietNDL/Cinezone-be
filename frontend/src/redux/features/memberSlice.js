
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  member: null,
  memberChecked: false,
};

const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    setMember: (state, action) => {
      state.member = action.payload;
    },
    setMemberChecked: (state, action) => {
      state.memberChecked = action.payload;
    },
    resetMember: () => initialState,
  },
});

export const { setMember, setMemberChecked, resetMember } = memberSlice.actions;

export default memberSlice.reducer;