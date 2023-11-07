import defaultAxios from "axios";

const axios = defaultAxios.create({
  baseURL: `https://tracesos.taguig.gov.ph:8080/https://api.openweathermap.org/data/2.5/`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export const fetchWeather = async ({ lat, lng }) => {
  try {
    const result = await axios.get(
      `weather?units=metric&lat=${lat}&lon=${lng}&appid=${
        import.meta.env.VITE_WEATHER_API_KEY
      }`
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const fetchForecast = async ({ lat, lng }) => {
  try {
    const result = await axios.get(
      `forecast?units=metric&lat=${lat}&lon=${lng}&appid=${
        import.meta.env.VITE_WEATHER_API_KEY
      }`
    );
    return result;
  } catch (err) {
    return err;
  }
};
