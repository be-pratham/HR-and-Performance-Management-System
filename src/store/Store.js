import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import employeeReducer from './reducers/employeeSlice'
import payrollReducer from './reducers/payrollSlice'
import performanceReducer from './reducers/performanceSlice'
import announcementReducer from './reducers/announcementSlice'
import taskReducer from './reducers/taskSlice'
import approvalReducer from './reducers/approvalSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer, 
    payroll: payrollReducer, 
    performance: performanceReducer,
    announcements: announcementReducer,
    tasks: taskReducer,
    approvals: approvalReducer,
}
});