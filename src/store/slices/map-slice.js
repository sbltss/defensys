import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
const initialState = {
  isLoading: false,
  fetchedTickets: [],
};
const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    reset: () => initialState,
    fetchTickets(state) {
      state.isLoading = true;
      state.fetchedTickets = [];
    },
    fetchTicketsSuccess(state, action) {
      state.isLoading = false;
      state.fetchedTickets = action.payload;
    },
    requestError(state, action) {
      message.warning(action.payload?.data?.message);
      state.isLoading = false;
    },
  },
});

export default mapSlice;
