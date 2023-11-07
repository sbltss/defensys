import { put, call, takeLatest } from "redux-saga/effects";
import { usherActions } from "../store";
import { fetchData, fetchToken } from "../api/usher-api";
///
///

function* fetchEventsRequest({ payload }) {
  const { fetchEventsSuccess, error, setToken } = usherActions;
  if (payload) {
    const result = yield call(fetchData, payload);
    if (result.name === "AxiosError") {
      yield put(error(result.response));
    } else {
      yield put(fetchEventsSuccess(result.data));
    }
  } else {
    const result2 = yield call(fetchToken, payload);
    if (result2.name === "AxiosError") {
      yield put(error(result2));
    } else {
      yield put(setToken(result2.data.access_token));

      const result3 = yield call(fetchData, result2.data.access_token);
      if (result3.name === "AxiosError") {
        yield put(error(result3.response));
      } else {
        yield put(fetchEventsSuccess(result3.data));
      }
    }
  }
}

// Export the saga (todo-saga)
export default function* usherSaga() {
  yield takeLatest(`usher/fetchEvents`, fetchEventsRequest);
}
