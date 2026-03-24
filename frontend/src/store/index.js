import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import studentReducer from './slices/studentSlice'
import feeReducer from './slices/feeSlice'
import attendanceReducer from './slices/attendanceSlice'
import courseReducer from './slices/courseSlice'
import testReducer from './slices/testSlice'
import materialReducer from './slices/materialSlice'
import notificationReducer from './slices/notificationSlice'
import analyticsReducer from './slices/analyticsSlice'
import teacherReducer from './slices/teacherSlice'
import doubtReducer from './slices/doubtSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    fees: feeReducer,
    attendance: attendanceReducer,
    courses: courseReducer,
    tests: testReducer,
    materials: materialReducer,
    notifications: notificationReducer,
    analytics: analyticsReducer,
    teachers: teacherReducer,
    doubts: doubtReducer,
  },
})
