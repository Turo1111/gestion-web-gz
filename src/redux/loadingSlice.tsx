import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.open = action.payload;
    },
    clearLoading: (state) => {
      state.open = false;
    },
  },
});


export const getLoading = (state: any) => state.loading;
export const { setLoading, clearLoading } = loadingSlice.actions;
export default loadingSlice.reducer;