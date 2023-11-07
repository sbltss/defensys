import { put, call, takeLatest } from "redux-saga/effects";
import { chatActions } from "../store";
import { getChats, sendChat } from "../api/chat-api";

function* fetchChatsRequest({ payload }) {
  const { setChats, requestError } = chatActions;

  const result = yield call(getChats, payload.transactionNumber);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(setChats(result.data));
  }
}

function* sendChatRequest({ payload }) {
  const { sendChatSuccess, requestError } = chatActions;

  const result = yield call(sendChat, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(sendChatSuccess(result.data));
  }
}

// Export the saga (todo-saga)
export default function* reportsSaga() {
  yield takeLatest(`chat/selectChatTicket`, fetchChatsRequest);
  yield takeLatest(`chat/sendChat`, sendChatRequest);
}
