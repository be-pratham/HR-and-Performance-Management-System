import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import employeeReducer from './reducers/employeeSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer, 
  },
});