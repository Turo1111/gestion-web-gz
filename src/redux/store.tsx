import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import loadingSlice from './loadingSlice'
import alertSlice from './alertSlice'

export const store = configureStore({
    reducer: {
        user: userSlice,
        loading: loadingSlice,
        alert: alertSlice,
    }
})

