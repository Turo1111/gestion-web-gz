import { UserWithToken } from "@/interfaces/auth.interface";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UserWithToken = {
  nickname: '',
  token: '',
  id: '',
  email: '',
  role: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.nickname = action.payload.nickname;
      state.token = action.payload.token;
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    clearUser: (state) => {
      state.nickname = '';
      state.token = '';
      state.id = '';
      state.email = '';
      state.role = undefined;
    },
  },
});

export const getUser = (state: {user: UserWithToken}) => state.user;

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
