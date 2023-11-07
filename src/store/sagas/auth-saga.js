import { put, call, takeLatest } from "redux-saga/effects";
import { authActions, usherActions, resourcesActions } from "../../store/store";
import {
  login,
  sendOtp,
  submitOtp,
  changePassword,
  changePasswordWithToken,
  dgsiLogin,
  demoLogin,
} from "../api/auth-api";

import { fetchCCInfo } from "../api/resources-api";
///
///

function* loginRequest({ payload }) {
  const { authenticate, loginError } = authActions;
  const { resetStates: resetUsher } = usherActions;
  const { resetStates: resetResources } = resourcesActions;

  const result = yield call(login, payload);
  if (result.name === "AxiosError") {
    yield put(loginError(result.response));
  } else {
    yield put(authenticate(result.data));
    yield put(resetUsher());
    yield put(resetResources());
  }
}

function* dgsiLoginRequest({ payload }) {
  const { authenticate, loginError } = authActions;
  const { resetStates: resetUsher } = usherActions;
  const { resetStates: resetResources } = resourcesActions;

  const result = yield call(dgsiLogin, payload);
  if (result.name === "AxiosError") {
    yield put(loginError(result.response));
  } else {
    yield put(authenticate(result.data));
    yield put(resetUsher());
    yield put(resetResources());
  }
}

function* sendOtpRequest({ payload }) {
  const { sendOtpSuccess, loginError } = authActions;

  const result = yield call(sendOtp, payload);
  if (result.name === "AxiosError") {
    yield put(loginError(result.response));
  } else {
    yield put(sendOtpSuccess(result.data));
  }
}

function* submitOtpRequest({ payload }) {
  const { submitOtpSuccess, submitOtpFail } = authActions;

  const result = yield call(submitOtp, payload);
  if (result.name === "AxiosError") {
    yield put(submitOtpFail(result.response));
  } else {
    yield put(submitOtpSuccess(result.data));
  }
}

function* changePasswordRequest({ payload }) {
  const { changePasswordSuccess, changePasswordFail } = authActions;

  const result = yield call(changePassword, payload);
  if (result.name === "AxiosError") {
    yield put(changePasswordFail(result.response));
  } else {
    yield put(changePasswordSuccess(result.data));
  }
}

function* changePassRequest({ payload }) {
  const { changePassSuccess, requestError } = authActions;

  const result = yield call(changePasswordWithToken, payload);
  if (result.name === "AxiosError") {
    yield put(requestError(result.response));
  } else {
    yield put(changePassSuccess(result.data));
  }
}

function* updateCurrentUserRequest({ payload }) {
  const { updateCurrentUserSuccess, requestError } = authActions;

  const result = yield call(fetchCCInfo, payload);
  if (result.name === "AxiosError") {
    yield put(requestError(result.response));
  } else {
    yield put(updateCurrentUserSuccess(result.data));
  }
}

function* demoLoginRequest({ payload }) {
  const { demoLoginSuccess, requestError } = authActions;

  const result = yield call(demoLogin, { accountType: payload.accountType });
  if (result.name === "AxiosError") {
    yield put(requestError(result.response));
  } else {
    yield put(demoLoginSuccess(result.data));
    if (payload.cb) yield call(payload.cb);
  }
}

// Export the saga (todo-saga)
export default function* authSaga() {
  yield takeLatest(`auth/login`, loginRequest);
  yield takeLatest(`auth/dgsiLogin`, dgsiLoginRequest);
  yield takeLatest(`auth/sendOtp`, sendOtpRequest);
  yield takeLatest(`auth/submitOtp`, submitOtpRequest);
  yield takeLatest(`auth/changePassword`, changePasswordRequest);
  yield takeLatest(`auth/changePass`, changePassRequest);
  yield takeLatest(`auth/updateCurrentUser`, updateCurrentUserRequest);
  yield takeLatest(`auth/demoLogin`, demoLoginRequest);
}
