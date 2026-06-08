import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from './dashboardSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    ui: uiReducer,
  },
})

export default store