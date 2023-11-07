import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
const initialState = {
  expanded: null,
  sosData: [],
  fetchSosDataLoading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    reset: () => initialState,
    setExpand(state, action) {
      state.expanded = action.payload;
    },
    getSosData(state) {
      state.fetchSosDataLoading = true;
    },
    getSosDataSuccess(state, action) {
      state.fetchSosDataLoading = false;
      state.sosData = action.payload;
    },
    requestError(state, action) {
      message.warning(action.payload?.data?.message);
      state.fetchSosDataLoading = false;
    },
  },
});

export default dashboardSlice;
