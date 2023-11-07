import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
const initialState = {
  isLoading: false,
  isAuthenticated: false,
  currentUser: null,
  token: null,
  mode: "login",
  otpToken: null,
  validOTP: false,
  recoveryEmail: null,
  socket: null,
  changePassModal: false,
  changePassLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    demoLogin(state) {
      state.isLoading = true;
    },
    demoLoginSuccess(state, { payload }) {
      state.isLoading = false;
      state.changePassModal = false;
      if (
        state.isAuthenticated &&
        state.currentUser.accountId === payload.data.accountId
      ) {
        //do nothing
      } else {
        state.currentUser = { ...payload?.data, isDemo: true };
        state.token = payload?.token;
        state.isAuthenticated = true;
      }
    },
    dismissChangePassModal(state) {
      state.changePassModal = false;
    },
    updateCurrentUser() {},
    updateCurrentUserSuccess(state, { payload }) {
      state.currentUser = { ...state.currentUser, ...payload };
    },
    changePass(state) {
      state.changePassLoading = true;
    },
    changePassSuccess(state, { payload }) {
      state.changePassLoading = false;
      state.changePassModal = false;
      message.success(payload.message);
    },
    setSocket(state, action) {
      state.socket = action.payload;
    },
    login(state) {
      state.isLoading = true;
    },
    dgsiLogin(state) {
      state.isLoading = true;
    },
    logout(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.mode = "login";
      state.token = null;
      state.socket = null;
    },
    authenticate(state, action) {
      state.currentUser = action.payload?.data;
      state.token = action.payload?.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.changePassModal = action.payload?.isDefaultPass;
    },
    setMode(state, action) {
      state.mode = action.payload;
    },
    sendOtp(state) {
      state.otpToken = null;
      state.isLoading = true;
      state.validOTP = false;
      state.recoveryEmail = null;
    },
    sendOtpSuccess(state, action) {
      message.success("One time password is sent to your email.");
      state.otpToken = action.payload?.token;
      state.validOTP = false;
      state.recoveryEmail = null;
      state.isLoading = false;
    },
    submitOtp(state) {
      state.isLoading = true;
      state.validOTP = false;
      state.recoveryEmail = null;
    },
    submitOtpFail(state, action) {
      message.warning(action.payload?.data?.message);
      state.isLoading = false;
      state.validOTP = false;
      state.recoveryEmail = null;
    },
    submitOtpSuccess(state, action) {
      message.success("One time password valid");
      state.isLoading = false;
      state.validOTP = true;
      state.recoveryEmail = action.payload?.email;
    },
    changePassword(state) {
      state.isLoading = true;
    },
    changePasswordFail(state) {
      state.isLoading = false;
    },
    changePasswordSuccess(state, action) {
      state.otpToken = null;
      message.success(action.payload?.message);
      state.mode = "login";
      state.isLoading = false;
      state.validOTP = false;
      state.recoveryEmail = null;
    },
    loginError(state, action) {
      state.isAuthenticated = false;
      message.warning(
        action.payload?.data?.message === 500
          ? "Internal Server Error"
          : action.payload?.data?.message
      );
      state.otpToken = null;
      state.isLoading = false;
      state.validOTP = false;
      state.recoveryEmail = null;
    },
    requestError(state, { payload }) {
      state.changePassLoading = false;
      state.isLoading = false;
      message.error(payload?.data?.message);
    },
  },
});

export default authSlice;
