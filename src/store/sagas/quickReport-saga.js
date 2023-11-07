import { put, call, takeLatest } from "redux-saga/effects";
import { quickReportActions } from "../store";
import { getCaseTypes, createEmergencyTicket } from "../api/public-api";

function* fetchCaseTypesRequest() {
  const { fetchCaseTypesSuccess, requestError } = quickReportActions;

  const result = yield call(getCaseTypes);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchCaseTypesSuccess(result.data));
  }
}

function* createReportRequest({ payload: { body, cb } }) {
  const { createReportSuccess, requestError } = quickReportActions;

  const result = yield call(createEmergencyTicket, body);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(createReportSuccess(result.data));
    yield call(cb);
  }
}

// Export the saga (todo-saga)
export default function* reportsSaga() {
  yield takeLatest(`quickReport/fetchCaseTypes`, fetchCaseTypesRequest);
  yield takeLatest(`quickReport/createReport`, createReportRequest);
}
