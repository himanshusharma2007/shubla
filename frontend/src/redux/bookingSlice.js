import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    data: null
  },
  reducers: {
    setbooking: (state, action) => {
      state.data = action.payload;
    },
    clearBooking: (state) =>{
        state.data = null
    }
  },
});

export const { setbooking, clearBooking } = bookingSlice.actions;

export default bookingSlice.reducer;
