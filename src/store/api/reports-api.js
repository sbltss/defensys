import defaultAxios from "axios";
import { getStore } from "../../helpers/injectedStore";
const axios = defaultAxios.create({
  baseURL: import.meta.env.VITE_BASE_URL + `/api/commandcenter/reports/`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

axios.interceptors.request.use(async function (config) {
  const store = getStore();
  config.headers.Authorization = `Bearer ${store.getState().auth.token}`;
  return config;
});

export const getDashboardData = async ({ body }) => {
  try {
    const result = await axios.post("getDashboardData", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const excludeRTReport = async (payload) => {
  try {
    const result = await axios.get("excludeRTReport/" + payload.param);
    return result;
  } catch (err) {
    return err;
  }
};

export const includeRTReport = async (payload) => {
  try {
    const result = await axios.get("includeRTReport/" + payload.param);
    return result;
  } catch (err) {
    return err;
  }
};
