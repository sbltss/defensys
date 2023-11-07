import { put, call, takeLatest } from "redux-saga/effects";
import { weatherActions } from "../store";
import { fetchWeather, fetchForecast } from "../api/resources-api";
///
///

function* fetchWeatherRequest({ payload }) {
  const { fetchWeatherSuccess, requestError } = weatherActions;
  let result = yield call(fetchWeather, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchWeatherSuccess(result.data));
  }
}

function* fetchForecastRequest({ payload }) {
  const { fetchForecastSuccess, requestError } = weatherActions;
  let result = yield call(fetchForecast, payload);
  if (!result || result.name === "AxiosError") {
    yield put(requestError(result?.response));
  } else {
    yield put(fetchForecastSuccess(result.data));
  }
}

// Export the saga (todo-saga)
export default function* usherSaga() {
  yield takeLatest(`weather/fetchWeather`, fetchWeatherRequest);
  yield takeLatest(`weather/fetchForecast`, fetchForecastRequest);
}
