import { createSlice, current } from "@reduxjs/toolkit";
import { message } from "antd";
const initialState = {
  selectedChatTicket: false,
  fetchChatsLoading: false,
  chats: [],
  sendChatLoading: false,
};
const emergencyTicketsSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    reset: () => initialState,
    selectChatTicket(state, action) {
      state.selectedChatTicket = action.payload;
      state.fetchChatsLoading = true;
    },
    deselectChatTicket(state) {
      state.selectedChatTicket = null;
      state.fetchChatsLoading = false;
      state.chats = [];
    },
    setChats(state, action) {
      state.chats = action.payload;
      state.fetchChatsLoading = false;
    },
    sendChat(state) {
      state.sendChatLoading = true;
    },
    sendChatSuccess(state, action) {
      message.success(action.payload.message);
      // state.chats = [...current(state.chats), action.payload.newChat];
      state.sendChatLoading = false;
    },
    updateChats(state, { payload }) {
      state.chats = [...state.chats, payload];
    },
    requestError(state, action) {
      message.warning(action.payload?.data?.message || "Request error");
      state.sendChatLoading = false;
      state.fetchChatsLoading = false;
    },
  },
});

export default emergencyTicketsSlice;
