import { UserWithToken } from "@/interfaces/auth.interface";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UserWithToken = {
  user: "",
  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.user = action.payload.token;
    },
    clearUser: (state) => {
      state.user = "";
      state.token = "";
    },
  },
});

export const getUser = (state: UserWithToken) => state.user;

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
