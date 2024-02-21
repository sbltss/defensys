import { put, call, takeLatest, takeEvery } from "redux-saga/effects";
import { resourcesActions } from "../store";
import * as resourcesApi from "../api/resources-api";

function* fetchResourcesRequest({ payload }) {
  const { setResources, requestError } = resourcesActions;
  try {
    const finalResult = {};
    for (const type of payload.toFetch) {
      if (payload.existing[type].length === 0) {
        let request = yield call(resourcesApi[type]);
        if (request.name === "AxiosError") {
          throw finalResult[type];
        } else {
          finalResult[type] = request.data;
        }
      }
    }
    yield put(setResources(finalResult));
  } catch (err) {
    console.log(err);
    yield put(requestError(err.response));
  }
}

function* updateResourcesRequest({ payload }) {
  const { setResources, requestError } = resourcesActions;
  try {
    const finalResult = {};
    for (const type of payload.toFetch) {
      let request = yield call(resourcesApi[type]);
      if (request.name === "AxiosError") {
        throw finalResult[type];
      } else {
        finalResult[type] = request.data;
      }
    }
    yield put(setResources(finalResult));
  } catch (err) {
    console.log(err);
    yield put(requestError(err.response));
  }
}

function* deactivateAccountRequest({ payload }) {
  const { deactivateAccountSuccess, requestError } = resourcesActions;
  let result;
  if (payload.listType === "deviceList") {
    result = yield call(resourcesApi.deactivateDevice, payload.accountId);
  } else {
    result = yield call(resourcesApi.deactivateAccount, payload.accountId);
  }
  if (result.name === "AxiosError") {
    yield put(requestError(result.response));
  } else {
    yield put(
      deactivateAccountSuccess({
        message: result.data.message,
        accountId: payload.accountId,
        listType: payload.listType,
      })
    );
  }
}

function* reactivateAccountRequest({ payload }) {
  const { reactivateAccountSuccess, requestError } = resourcesActions;
  let result;
  if (payload.listType === "deviceList") {
    result = yield call(resourcesApi.reactivateDevice, payload.accountId);
  } else {
    result = yield call(resourcesApi.reactivateAccount, payload.accountId);
  }
  if (result.name === "AxiosError") {
    yield put(requestError(result.response));
  } else {
    yield put(
      reactivateAccountSuccess({
        message: result.data.message,
        accountId: payload.accountId,
        listType: payload.listType,
      })
    );
  }
}

function* updateAccountRequest({ payload }) {
  const { updateAccountSuccess, requestError } = resourcesActions;
  let result;
  if (payload.listType === "deviceList") {
    result = yield call(resourcesApi.updateDevice, {
      param: payload.accountId,
      body: payload.body,
    });
  } else {
    result = yield call(resourcesApi.updateAccount, {
      param: payload.accountId,
      body: payload.body,
    });
  }
  if (result.name === "AxiosError") {
    yield put(requestError(result.response));
  } else {
    yield put(
      updateAccountSuccess({
        message: result.data.message,
        accountId: payload.accountId,
        listType: payload.listType,
        body: payload.body,
      })
    );
  }
}

function* addAccountRequest({ payload }) {
  const { addAccountSuccess, requestError } = resourcesActions;
  let type;
  if (payload.listType === "agentList") type = "addAgent";
  if (payload.listType === "departmentList") type = "addDepartment";
  if (payload.listType === "supervisorList") type = "addSupervisor";
  if (payload.listType === "contentWriters") type = "addContentWriter";
  if (payload.listType === "responseTeamsList") type = "addResponseTeam";
  if (payload.listType === "deviceList") type = "addDevice";

  let result = yield call(resourcesApi[type], payload.body);
  if (result.name === "AxiosError") {
    yield put(requestError(result.response));
  } else {
    yield put(
      addAccountSuccess({
        message: result.data.message,
        data: result.data.data,
        listType: payload.listType,
      })
    );
  }
}

function* addCaseTypeRequest({ payload }) {
  const { addCaseTypeSuccess, requestError } = resourcesActions;
  let result = yield call(resourcesApi[payload.listType], payload.body);
  if (result.name === "AxiosError") {
    yield put(requestError(result.response));
  } else {
    console.log(result);
    yield put(
      addCaseTypeSuccess({
        message: result.data.message,
        data: result.data.data,
        listType: "caseTypes",
      })
    );
  }
}

function* updateCaseTypeRequest({ payload }) {
  const { updateCaseTypeSuccess, requestError } = resourcesActions;
  let result = yield call(resourcesApi.updateCaseType, {
    param: payload.id,
    body: payload.body,
  });

  if (result.name === "AxiosError") {
    yield put(requestError(result.response));
  } else {
    yield put(
      updateCaseTypeSuccess({
        message: result.data.message,
        listType: "caseTypes",
        body: payload.body,
        id: payload.id,
      })
    );
  }
}

function* deactivateCaseTypeRequest({ payload }) {
  const { deactivateCaseTypeSuccess, requestError } = resourcesActions;
  let result = yield call(resourcesApi.deactivateCaseType, {
    param: payload.id,
  });

  if (result.name === "AxiosError") {
    yield put(requestError(result.response));
  } else {
    yield put(
      deactivateCaseTypeSuccess({
        message: result.data.message,
        listType: "caseTypes",
        body: result.data.body,
        id: payload.id,
      })
    );
  }
}

// Export the saga (todo-saga)
export default function* reportsSaga() {
  yield takeEvery(`resources/fetchResources`, fetchResourcesRequest);
  yield takeLatest(`resources/updateResources`, updateResourcesRequest);
  yield takeLatest(`resources/deactivateAccount`, deactivateAccountRequest);
  yield takeLatest(`resources/reactivateAccount`, reactivateAccountRequest);
  yield takeLatest(`resources/updateAccount`, updateAccountRequest);
  yield takeLatest(`resources/addAccount`, addAccountRequest);
  yield takeLatest(`resources/addCaseType`, addCaseTypeRequest);
  yield takeLatest(`resources/updateCaseType`, updateCaseTypeRequest);
  yield takeLatest(`resources/deactivateCaseType`, deactivateCaseTypeRequest);
}
