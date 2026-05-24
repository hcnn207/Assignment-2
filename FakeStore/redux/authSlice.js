import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
  token: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token || null;
    },

    signOut: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },

    updateUserInfo: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload
      };
    }
  }
});

export const {
  signInSuccess,
  signOut,
  updateUserInfo
} = authSlice.actions;

export default authSlice.reducer;