import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
const initialState = {
  cctvList: [],
  fetchCctvLoading: false,
  cctvStreams: [],
  fetchCctvStreamsLoading: false,
};
const cctvSlice = createSlice({
  name: "cctv",
  initialState,
  reducers: {
    reset: () => initialState,
    fetchCctv(state) {
      state.fetchCctvLoading = true;
    },
    fetchCctvSuccess(state, { payload }) {
      state.cctvList = payload;
      state.fetchCctvLoading = false;
    },
    fetchCctvStreams(state) {
      state.fetchCctvStreamsLoading = true;
    },
    fetchCctvStreamsSuccess(state, { payload }) {
      state.cctvStreams = payload;
      state.fetchCctvStreamsLoading = false;
    },
    requestError(state, action) {
      message.warning(action.payload?.data?.message || "Request error");
      state.fetchCctvLoading = false;
      state.fetchCctvStreamsLoading = false;
    },
  },
});

export default cctvSlice;
