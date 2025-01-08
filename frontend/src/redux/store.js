
import { configureStore } from '@reduxjs/toolkit';
import availabilityReducer from './availabilitySlice';
import authReducer from './authSlice';
import bookingReducer from './bookingSlice';

const store = configureStore({
  reducer: {
    availability: availabilityReducer,
    auth: authReducer,
    booking: bookingReducer
  },
});

export default store;
