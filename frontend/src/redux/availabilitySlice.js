import { createSlice } from '@reduxjs/toolkit';

const availabilitySlice = createSlice({
  name: 'availability',
  initialState: {
    availability: {},
    checkOutDate: '',
    // other state variables
  },
  reducers: {
    setCheckOutDate: (state, action) => {
      state.checkOutDate = action.payload;
    },
    decrementQuantity: (state, action) => {
      const { roomId, date, quantity } = action.payload;
      if (!state.availability[roomId]) {
        state.availability[roomId] = {};
      }
      if (state.availability[roomId][date]) {
        state.availability[roomId][date] -= quantity;
      }
    },
    // other reducers
  },
});

export const { setCheckOutDate, decrementQuantity } = availabilitySlice.actions;

export default availabilitySlice.reducer;
