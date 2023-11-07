import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
const initialState = {
  events: [],
  fetchEventsLoading: false,
  accessToken: null,
};

const usherSlice = createSlice({
  name: "usher",
  initialState,
  reducers: {
    reset: () => initialState,
    fetchEvents(state) {
      state.fetchEventsLoading = true;
    },
    fetchEventsSuccess(state, action) {
      state.events = action.payload?.data?.warnings;
      state.fetchEventsLoading = false;
    },
    setToken(state, action) {
      state.accessToken = action.payload;
    },
    resetStates(state) {
      state.accessToken = null;
      state.events = [];
      state.fetchEventsLoading = true;
    },
    error(state, action) {
      message.warning(action.payload?.message);
      state.events = [];
      state.fetchEventsLoading = true;
    },
  },
});

export default usherSlice;
