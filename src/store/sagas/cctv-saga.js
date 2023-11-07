import { put, call, takeLatest } from "redux-saga/effects";
import { cctvActions } from "../store";
import { fetchCctv, fetchCctvStreams } from "../api/cctv-api";

function* fetchCctvRequest() {
  const { fetchCctvSuccess, requestError } = cctvActions;

  const result = yield call(fetchCctv);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchCctvSuccess(result.data));
  }
}
function* fetchCctvStreamsRequest() {
  const { fetchCctvStreamsSuccess, requestError } = cctvActions;

  const result = yield call(fetchCctvStreams);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchCctvStreamsSuccess(result.data));
  }
}

// Export the saga (todo-saga)
export default function* reportsSaga() {
  yield takeLatest(`cctv/fetchCctv`, fetchCctvRequest);
  yield takeLatest(`cctv/fetchCctvStreams`, fetchCctvStreamsRequest);
}
