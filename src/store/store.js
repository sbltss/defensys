import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slices/auth-slice";
import reportsSlice from "./slices/reports-slice";
import mapSlice from "./slices/map-slice";
import resourcesSlice from "./slices/resources-slice";
import ticketsSlice from "./slices/tickets-slice";
import usherSlice from "./slices/usher-slice";
import dashboardSlice from "./slices/dashboard-slice";
import chatSlice from "./slices/chat-slice";
import callSlice from "./slices/call-slice";
import cctvSlice from "./slices/cctv-slice";
import quickReportSlice from "./slices/quickReport-slice";
import weatherSlice from "./slices/weather-slice";
import createSagaMiddleware from "@redux-saga/core";

import authSaga from "./sagas/auth-saga";
import ticketSaga from "./sagas/ticket-saga";
import mapSaga from "./sagas/map-saga";
import resourcesSaga from "./sagas/resources-saga";
import usherSaga from "./sagas/usher-saga";
import chatSaga from "./sagas/chat-saga";
import callSaga from "./sagas/call-saga";
import cctvSaga from "./sagas/cctv-saga";
import quickReportSaga from "./sagas/quickReport-saga";
import weatherSaga from "./sagas/weather-saga";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import newsSlice from "./slices/news-slice";
import newsSaga from "./sagas/news-saga";
import { newsSlice } from "./slices/news-slice";

const rootPersistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: [],
};
const authPersistConfig = {
  key: "auth",
  version: 1,
  storage,
  blacklist: [
    "isLoading",
    "mode",
    "otpToken",
    "sendOtpLoading",
    "submitOtpLoading",
    "changePasswordLoading",
    "recoveryEmail",
    "validOTP",
    "socket",
    "changePassModal",
    "changePassLoading",
  ],
};
const usherPersistConfig = {
  key: "usher",
  version: 1,
  storage,
  blacklist: ["events", "fetchEventsLoading"],
};
const resourcesPersistConfig = {
  key: "resources",
  version: 1,
  storage,
  whitelist: [],
};
const quickReportPersistConfig = {
  key: "quickReport",
  version: 1,
  storage,
  whitelist: ["userId"],
};
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice.reducer),
  usher: persistReducer(usherPersistConfig, usherSlice.reducer),
  reports: reportsSlice.reducer,
  map: mapSlice.reducer,
  resources: persistReducer(resourcesPersistConfig, resourcesSlice.reducer),
  tickets: ticketsSlice.reducer,
  dashboard: dashboardSlice.reducer,
  chat: chatSlice.reducer,
  call: callSlice.reducer,
  cctv: cctvSlice.reducer,
  quickReport: persistReducer(quickReportPersistConfig, quickReportSlice.reducer),
  weather: weatherSlice.reducer,
  // news: newsSlice.reducer,
  news: newsSlice.reducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const saga = createSagaMiddleware();
const store = configureStore({
  reducer: persistedReducer,
  middleware: [saga],
});

saga.run(authSaga);
saga.run(ticketSaga);
saga.run(resourcesSaga);
saga.run(usherSaga);
saga.run(chatSaga);
saga.run(callSaga);
saga.run(cctvSaga);
saga.run(quickReportSaga);
saga.run(weatherSaga);
saga.run(mapSaga);
saga.run(newsSaga);
export const authActions = authSlice.actions;
export const usherActions = usherSlice.actions;
export const reportsActions = reportsSlice.actions;
export const mapActions = mapSlice.actions;
export const resourcesActions = resourcesSlice.actions;
export const ticketsActions = ticketsSlice.actions;
export const dashboardActions = dashboardSlice.actions;
export const chatActions = chatSlice.actions;
export const callActions = callSlice.actions;
export const cctvActions = cctvSlice.actions;
export const quickReportActions = quickReportSlice.actions;
export const weatherActions = weatherSlice.actions;
export const persistor = persistStore(store);
export default store;
