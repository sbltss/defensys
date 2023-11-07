import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
const initialState = {
  userId: null,
  caseTypes: [],
  fetchCaseTypesLoading: false,
  createReportLoading: false,
};

const quickReportSlice = createSlice({
  name: "quickReport",
  initialState,
  reducers: {
    reset: () => initialState,
    setId(state, { payload }) {
      state.userId = payload;
    },

    fetchCaseTypes(state) {
      state.fetchCaseTypesLoading = true;
    },

    fetchCaseTypesSuccess(state, { payload }) {
      state.caseTypes = payload;
      state.fetchCaseTypesLoading = false;
    },

    createReport(state) {
      state.createReportLoading = true;
    },

    createReportSuccess(state, { payload }) {
      message.success(payload.message);
      state.createReportLoading = false;
    },

    requestError(state, action) {
      message.warning(
        action.payload?.data?.message === 500
          ? "Internal Server Error"
          : action.payload?.data?.message
      );
      state.fetchCaseTypesLoading = false;
      state.createReportLoading = false;
    },
  },
});

export default quickReportSlice;
