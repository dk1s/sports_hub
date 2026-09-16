import { configureStore } from '@reduxjs/toolkit'
import { sportsApi } from '../services/apiSlice'

export const store = configureStore({
  reducer: {
    [sportsApi.reducerPath]: sportsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sportsApi.middleware),
})