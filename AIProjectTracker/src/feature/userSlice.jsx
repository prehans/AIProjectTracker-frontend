import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user:null,
    token: localStorage.getItem("token") || null,
  },
  reducers:{
    login: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
       state.token = null;
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    },
  },
})

export const {login, logout} = userSlice.actions;

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;