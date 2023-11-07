import { put, call, takeLatest, takeEvery } from "redux-saga/effects";
import {
  reportsActions,
  ticketsActions,
  dashboardActions,
} from "../../store/store";

import {
  getReportByDate,
  getReportData,
  getPendingTickets,
  getAcceptedTickets,
  getReportedTickets,
  getTransferredTickets,
  readTicket,
  unreadTicket,
  assignToDepartment,
  reportTicket,
  getAssignedDepartments,
  getAssignedResponseTeams,
  assignToResponseTeam,
  getDeclinedTickets,
  getTicketNotif,
  getChatNotif,
  acceptTicket,
  declineTicket,
  resolveTicket,
  getReportsOfTheDay,
  getSupervisorTickets,
  getOfflineReports,
  getArchivedReportsOfTheDay,
} from "../api/ticket-api";
import { getDashboardData } from "../api/reports-api";
import { blockCitizen } from "../api/citizen-api";

function* fetchTicketsRequest({ payload }) {
  const { fetchTicketsSuccess, requestError } = reportsActions;

  const result = yield call(getReportByDate, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchTicketsSuccess(result.data));
  }
}

function* fetchReportDataRequest({ payload }) {
  const { setReportData, requestError } = reportsActions;
  let result = yield call(getReportData, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(setReportData(result.data));
  }
}

function* fetchPendingTicketsRequest({ payload }) {
  const { fetchPendingTicketsSuccess, requestError } = ticketsActions;
  let result = yield call(getPendingTickets, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchPendingTicketsSuccess(result.data));
  }
}

function* fetchAcceptedTicketsRequest({ payload }) {
  const { fetchAcceptedTicketsSuccess, requestError, selectAcceptedTicket } =
    ticketsActions;
  let result = yield call(getAcceptedTickets);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchAcceptedTicketsSuccess(result.data));
    if (!!payload)
      yield put(selectAcceptedTicket({ transactionNumber: payload }));
  }
}

function* fetchReportedTicketsRequest({ payload }) {
  const { fetchReportedTicketsSuccess, requestError } = ticketsActions;
  let result = yield call(getReportedTickets, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchReportedTicketsSuccess(result.data));
  }
}

function* fetchDeclinedTicketsRequest({ payload }) {
  const { fetchDeclinedTicketsSuccess, requestError } = ticketsActions;
  let result = yield call(getDeclinedTickets, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchDeclinedTicketsSuccess(result.data));
  }
}

function* fetchReportsOfTheDayRequest() {
  const { fetchReportsOfTheDaySuccess, requestError } = ticketsActions;
  let result = yield call(getReportsOfTheDay);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchReportsOfTheDaySuccess(result.data));
  }
}

function* fetchArchivedReportsOfTheDayRequest() {
  const { fetchArchivedReportsOfTheDaySuccess, requestError } = ticketsActions;
  let result = yield call(getArchivedReportsOfTheDay);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchArchivedReportsOfTheDaySuccess(result.data));
  }
}

function* fetchSupervisorTicketsRequest() {
  const { fetchSupervisorTicketsSuccess, requestError } = ticketsActions;
  let result = yield call(getSupervisorTickets);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchSupervisorTicketsSuccess(result.data));
  }
}

function* fetchTransferredTicketsRequest({ payload }) {
  const { fetchTransferredTicketsSuccess, requestError } = ticketsActions;
  let result = yield call(getTransferredTickets, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchTransferredTicketsSuccess(result.data));
  }
}

function* getSosDataRequest({ payload }) {
  const { getSosDataSuccess, requestError } = dashboardActions;
  let result = yield call(getDashboardData, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(getSosDataSuccess(result.data));
  }
}

function* readTicketRequest({ payload }) {
  const { requestError, updatePendingTickets } = ticketsActions;
  let result = yield call(readTicket, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(updatePendingTickets(result.data.data));
  }
}

function* unreadTicketRequest({ payload }) {
  const { selectPendingTicket, updatePendingTickets, requestError } =
    ticketsActions;
  let result = yield call(unreadTicket, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(selectPendingTicket(null));
    console.log(result.data.data)
    yield put(updatePendingTickets(result.data.data));
  }
}

function* assignToDepartmentRequest({ payload }) {
  const { assignToDepartmentSuccess, requestError, fetchAssignedDepartments } =
    ticketsActions;
  let result = yield call(assignToDepartment, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(assignToDepartmentSuccess(result.data));
    if (!result.data.data) yield put(fetchAssignedDepartments(payload.param));
    if (payload.cb) yield call(payload.cb);
  }
}

function* reportTicketRequest({ payload }) {
  const { reportTicketSuccess, requestError } = ticketsActions;
  let result = yield call(reportTicket, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(reportTicketSuccess(result.data));
    if (payload.cb) yield call(payload.cb);
  }
}

function* blockCitizenRequest({ payload }) {
  const { blockCitizenSuccess, requestError } = ticketsActions;
  let result = yield call(blockCitizen, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(blockCitizenSuccess(result.data));
  }
}

// function* selectAcceptedTicketRequest({ payload }) {
//   if (payload) {
//     const { currentUser } = yield select((state) => state.auth);
//     if (currentUser.accountType === "agent") {
//       const { setAssignedDepartments, requestError } = ticketsActions;
//       let result = yield call(
//         getAssignedDepartments,
//         payload.transactionNumber
//       );
//       if (!result || result.name === "AxiosError") {
//         yield put(requestError(result?.response));
//       } else {
//         yield put(setAssignedDepartments(result.data));
//       }
//     } else if (currentUser.accountType === "department") {
//       const { setAssignedResponseTeams, requestError } = ticketsActions;
//       let result = yield call(getAssignedResponseTeams, {
//         body: { departmentId: currentUser.accountId },
//         param: payload.transactionNumber,
//       });
//       if (!result || result.name === "AxiosError") {
//         yield put(requestError(result?.response));
//       } else {
//         yield put(
//           setAssignedResponseTeams({
//             responseTeams: [...result.data],
//             accountType: "department",
//           })
//         );
//       }
//     }
//   }
// }

function* fetchAssignedDepartmentsRequest({ payload }) {
  const { fetchAssignedDepartmentsSuccess, requestError } = ticketsActions;
  let result = yield call(getAssignedDepartments, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchAssignedDepartmentsSuccess(result.data));
  }
}

function* fetchAssignedResponseTeamsRequest({ payload }) {
  const { fetchAssignedResponseTeamsSuccess, requestError } = ticketsActions;
  let result = yield call(getAssignedResponseTeams, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchAssignedResponseTeamsSuccess(result.data));
  }
}

function* assignToResponseTeamRequest({ payload }) {
  const { assignToResponseTeamSuccess, requestError } = ticketsActions;
  let result = yield call(assignToResponseTeam, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(assignToResponseTeamSuccess(result.data));
  }
}

function* fetchTicketNotifsRequest() {
  const { fetchTicketNotifsSuccess, requestError } = ticketsActions;
  let result = yield call(getTicketNotif);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchTicketNotifsSuccess(result.data));
  }
}

function* fetchChatNotifsRequest() {
  const { fetchChatNotifsSuccess, requestError } = ticketsActions;
  let result = yield call(getChatNotif);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchChatNotifsSuccess(result.data));
  }
}

function* acceptTicketRequest({ payload }) {
  const { acceptTicketSuccess, requestError } = ticketsActions;
  let result = yield call(acceptTicket, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(acceptTicketSuccess(result.data));
  }
}

function* declineTicketRequest({ payload }) {
  const { declineTicketSuccess, requestError } = ticketsActions;
  let result = yield call(declineTicket, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(declineTicketSuccess(result.data));
    if (payload.cb) yield call(payload.cb);
  }
}

function* resolveTicketRequest({ payload }) {
  const { resolveTicketSuccess, requestError } = ticketsActions;
  let result = yield call(resolveTicket, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(resolveTicketSuccess(result.data));
    if (payload.cb) yield call(payload.cb);
  }
}

function* fetchOfflineReportsRequest() {
  const { fetchOfflineReportsSuccess, requestError } = ticketsActions;
  let result = yield call(getOfflineReports);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchOfflineReportsSuccess(result.data));
  }
}

// Export the saga (todo-saga)
export default function* reportsSaga() {
  yield takeLatest(`reports/fetchTickets`, fetchTicketsRequest);
  yield takeLatest(`reports/fetchReportData`, fetchReportDataRequest);
  yield takeLatest(
    `emergencyTickets/fetchPendingTickets`,
    fetchPendingTicketsRequest
  );
  yield takeLatest(
    `emergencyTickets/fetchAcceptedTickets`,
    fetchAcceptedTicketsRequest
  );
  yield takeLatest(
    `emergencyTickets/fetchReportedTickets`,
    fetchReportedTicketsRequest
  );
  yield takeLatest(
    `emergencyTickets/fetchDeclinedTickets`,
    fetchDeclinedTicketsRequest
  );
  yield takeLatest(
    `emergencyTickets/fetchReportsOfTheDay`,
    fetchReportsOfTheDayRequest
  );
  yield takeLatest(
    `emergencyTickets/fetchArchivedReportsOfTheDay`,
    fetchArchivedReportsOfTheDayRequest
  );
  yield takeLatest(
    `emergencyTickets/fetchSupervisorTickets`,
    fetchSupervisorTicketsRequest
  );
  yield takeLatest(
    `emergencyTickets/fetchTransferredTickets`,
    fetchTransferredTicketsRequest
  );
  yield takeLatest(`dashboard/getSosData`, getSosDataRequest);

  yield takeLatest(`emergencyTickets/readTicket`, readTicketRequest);
  yield takeLatest(`emergencyTickets/unreadTicket`, unreadTicketRequest);
  yield takeLatest(
    `emergencyTickets/assignToDepartment`,
    assignToDepartmentRequest
  );
  yield takeLatest(`emergencyTickets/reportTicket`, reportTicketRequest);
  yield takeLatest(`emergencyTickets/blockCitizen`, blockCitizenRequest);

  yield takeEvery(
    `emergencyTickets/fetchAssignedDepartments`,
    fetchAssignedDepartmentsRequest
  );

  // yield takeLatest(
  //   `emergencyTickets/selectAcceptedTicket`,
  //   selectAcceptedTicketRequest
  // );
  yield takeEvery(
    `emergencyTickets/fetchAssignedResponseTeams`,
    fetchAssignedResponseTeamsRequest
  );

  yield takeLatest(
    `emergencyTickets/assignToResponseTeam`,
    assignToResponseTeamRequest
  );
  yield takeLatest(
    `emergencyTickets/fetchTicketNotifs`,
    fetchTicketNotifsRequest
  );
  yield takeLatest(`emergencyTickets/fetchChatNotifs`, fetchChatNotifsRequest);

  yield takeLatest(`emergencyTickets/acceptTicket`, acceptTicketRequest);
  yield takeLatest(`emergencyTickets/declineTicket`, declineTicketRequest);
  yield takeLatest(`emergencyTickets/resolveTicket`, resolveTicketRequest);

  yield takeLatest(
    `emergencyTickets/fetchOfflineReports`,
    fetchOfflineReportsRequest
  );
}
