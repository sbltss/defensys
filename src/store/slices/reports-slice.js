import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
const initialState = {
  isLoading: false,
  fetchedTickets: [],
  fetchReportLoading: false,
  reportData: null,
  selectedTicket: null,
  report: {},
};
let loadingMessageExpire;
const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    reset: () => initialState,
    setSelectedTicket(state, { payload }) {
      state.selectedTicket = payload;
      if (!payload) state.reportData = null;
    },
    fetchTickets(state) {
      state.isLoading = true;
      state.fetchedTickets = [];
    },
    fetchTicketsSuccess(state, action) {
      state.isLoading = false;
      state.fetchedTickets = action.payload;
    },
    fetchReportData(state) {
      loadingMessageExpire = message.loading("Loading Report...");
      state.fetchReportLoading = true;
      state.reportData = null;
    },
    setReportData(state, action) {
      loadingMessageExpire();
      state.fetchReportLoading = false;
      state.reportData = action.payload;
    },
    deselectReportData(state, action) {
      state.reportData = null;
    },
    resetStates(state) {
      state.isLoading = false;
      state.fetchedTickets = [];
      state.fetchReportLoading = false;
      state.reportData = null;
    },
    requestError(state, action) {
      message.warning(action.payload?.data?.message);
      state.isLoading = false;
      state.fetchedTickets = [];
      state.fetchReportLoading = false;
      state.reportData = null;
    },
  },
});

export default reportsSlice;
