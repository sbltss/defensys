import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
const initialState = {
  weather: {},
  fetchWeatherLoading: false,
  forecast: {},
  fetchForecastLoading: false,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    reset: () => initialState,
    fetchWeather(state) {
      state.fetchWeatherLoading = true;
    },
    fetchWeatherSuccess(state, action) {
      state.weather = action.payload;
      state.fetchWeatherLoading = false;
    },
    fetchForecast(state) {
      state.fetchForecastLoading = true;
    },
    fetchForecastSuccess(state, action) {
      state.forecast = action.payload;
      state.fetchForecastLoading = false;
    },
    requestError(state, action) {
      message.warning(action.payload?.message);
      state.fetchWeatherLoading = false;
      state.fetchForecastLoading = false;
    },
  },
});

export default weatherSlice;
