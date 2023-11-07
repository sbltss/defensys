import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const initialState = {
  isLoading: false,
  newsList: [],
};

export const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    getNewsFetch(state) {
      state.isLoading = true;
    },
    getNewsSuccess(state, { payload }) {
      state.newsList = payload.data;
      state.isLoading = false;
      // message.success(payload.message);
    },
    getNewsError(state, { payload }) {
      state.isLoading = false;
      state.newsList = [];
      message.warning(payload.message);
    },
    creatingNews(state) {
      state.isLoading = true;
    },
    createNewsSuccess(state, { payload }) {
      state.isLoading = false;
      message.success(payload.message);
    },
    createNewsError(state, { payload }) {
      state.isLoading = false;
      message.error(payload.message);
    },
    removingNews(state) {
      state.isLoading = true;
    },
    removeNewsSuccess(state, { payload }) {
      state.isLoading = false;
      message.success(payload.message);
    },
    removeNewsError(state, { payload }) {
      state.isLoading = false;
      message.error(payload.message);
    },
    updatingNews(state) {
      state.isLoading = true;
    },
    updateNewsSuccess(state, { payload }) {
      state.isLoading = false;
      message.success(payload.message);
    },
    updateNewsError(state, { payload }) {
      state.isLoading = false;
      message.error(payload.message);
    },
    removingContent(state) {
      state.isLoading = true;
    },
    removeContentSuccess(state, { payload }) {
      state.isLoading = false;
      message.success(payload.message);
    },
    removeContentError(state, { payload }) {
      state.isLoading = false;
      message.error(payload.message);
    },
    addingContent(state) {
      state.isLoading = true;
    },
    addContentSuccess(state, { payload }) {
      state.isLoading = false;
      message.success(payload.message);
    },
    addContentError(state, { payload }) {
      state.isLoading = false;
      message.error(payload.message);
    },
    edittingContent(state) {
      state.isLoading = true;
    },
    editContentSuccess(state, { payload }) {
      state.isLoading = false;
      message.success(payload.message);
    },
    editContentError(state, { payload }) {
      state.isLoading = false;
      message.error(payload.message);
    },
  },
});

export const {
  getNewsFetch,
  getNewsSuccess,
  getNewsError,
  removeNewsError,
  removeNewsSuccess,
  removingNews,
  updatingNews,
  updateNewsError,
  updateNewsSuccess,
  creatingNews,
  createNewsError,
  createNewsSuccess,
  removeContentError,
  removeContentSuccess,
  removingContent,
  addContentError,
  addContentSuccess,
  addingContent,
  editContentError,
  editContentSuccess,
  edittingContent,
} = newsSlice.actions;

export default newsSlice.reducer;
