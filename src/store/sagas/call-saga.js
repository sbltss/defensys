import { put, call, takeLatest } from "redux-saga/effects";
import { callActions, ticketsActions } from "../store";
import { addCallLog, getCallLogs, createTicketFromCall } from "../api/call-api";
import { searchCitizen } from "../api/citizen-api";

function* addCallLogRequest({ payload }) {
  const { requestError, addCallLogSuccess } = callActions;

  const result = yield call(addCallLog, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(addCallLogSuccess(result.data));
  }
}

function* fetchCallLogsRequest({ payload }) {
  const { requestError, fetchCallLogsSuccess } = callActions;

  const result = yield call(getCallLogs, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchCallLogsSuccess(result.data));
  }
}

function* fetchCitizenInfoRequest({ payload }) {
  const { requestError, fetchCitizenInfoSuccess } = callActions;

  const result = yield call(searchCitizen, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(
      fetchCitizenInfoSuccess(result.data.length > 0 ? result.data[0] : {})
    );
  }
}

function* createTicketFromCallRequest({ payload }) {
  const { requestError, createTicketFromCallSuccess } = callActions;
  const { fetchAcceptedTickets } = ticketsActions;

  const result = yield call(createTicketFromCall, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(createTicketFromCallSuccess(result.data));
    yield put(fetchAcceptedTickets(result.data.transactionNumber));
  }
}

// Export the saga (todo-saga)
export default function* reportsSaga() {
  yield takeLatest(`call/addCallLog`, addCallLogRequest);
  yield takeLatest(`call/fetchCallLogs`, fetchCallLogsRequest);
  yield takeLatest(`call/fetchCitizenInfo`, fetchCitizenInfoRequest);
  yield takeLatest(`call/createTicketFromCall`, createTicketFromCallRequest);
}
