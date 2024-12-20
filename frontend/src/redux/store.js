
import { configureStore } from '@reduxjs/toolkit';
import availabilityReducer from './availabilitySlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    availability: availabilityReducer,
    auth: authReducer
  },
});

export default store;
