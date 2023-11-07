import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
const initialState = {
  status: "CONNECTING",
  peerStatus: "reconnecting",
  callLogs: [],
  fetchCallLogsLoading: false,
  citizenInfo: null,
  fetchCitizenInfoLoading: false,
  createTicketFromCallLoading: false,
  onlineListOpen: false,
  peer: null,
  callMode: null,
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    reset: () => initialState,
    setCitizenInfo(state, { payload }) {
      state.citizenInfo = payload;
    },
    setCallMode(state, { payload }) {
      state.callMode = payload;
    },
    setPeer(state, { payload }) {
      state.peer = payload;
    },
    setOnlineListOpen(state, { payload }) {
      state.onlineListOpen = payload;
    },
    createTicketFromCall(state) {
      state.createTicketFromCallLoading = true;
    },
    createTicketFromCallSuccess(state, { payload }) {
      state.createTicketFromCallLoading = false;
      message.success(payload.message);
      if (payload.info) message.info(payload.info, 5);
    },
    fetchCitizenInfo(state) {
      state.fetchCitizenInfoLoading = true;
    },
    fetchCitizenInfoSuccess(state, { payload }) {
      state.citizenInfo = payload;
      state.fetchCitizenInfoLoading = false;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setPeerStatus(state, action) {
      state.peerStatus = action.payload;
    },
    addCallLog() {},
    addCallLogSuccess(state, { payload }) {
      message.success(payload.message);
    },
    fetchCallLogs(state) {
      state.fetchCallLogsLoading = true;
    },
    fetchCallLogsSuccess(state, { payload }) {
      state.callLogs = payload;
      state.fetchCallLogsLoading = false;
    },
    requestError(state, action) {
      message.warning(
        action.payload?.data?.message === 500
          ? "Internal Server Error"
          : action.payload?.data?.message
      );
      state.fetchCallLogsLoading = false;
      state.fetchCitizenInfoLoading = false;
      state.createTicketFromCallLoading = false;
    },
  },
});

export default callSlice;
