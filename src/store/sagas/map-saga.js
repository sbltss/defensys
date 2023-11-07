import { put, call, takeLatest } from "redux-saga/effects";
import { mapActions } from "../store";
import { getReportByDate } from "../api/ticket-api";

function* fetchTicketsRequest({ payload }) {
  const { fetchTicketsSuccess, requestError } = mapActions;

  const result = yield call(getReportByDate, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchTicketsSuccess(result.data));
  }
}

// Export the saga (todo-saga)
export default function* reportsSaga() {
  yield takeLatest(`map/fetchTickets`, fetchTicketsRequest);
}
