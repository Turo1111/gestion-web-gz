import { UserWithToken } from "@/interfaces/auth.interface";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UserWithToken = {
  nickname: '',
  token: '',
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.nickname = action.payload.nickname;
      state.token = action.payload.token;
    },
    clearUser: (state) => {
      state.nickname = '';
      state.token = '';
    },
  },
});

export const getUser = (state: {user: UserWithToken}) => state.user;

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
