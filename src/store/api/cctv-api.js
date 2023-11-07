import defaultAxios from "axios";
import { message } from "antd";
import { getStore } from "../../helpers/injectedStore";
const axios = defaultAxios.create({
  baseURL: import.meta.env.VITE_BASE_URL + `/api/commandcenter/cctv/`,
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

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      message.error("Session Expired");
      localStorage.clear("persist:auth");
      window.location.reload();
    }
    return error;
  }
);

export const fetchCctv = async () => {
  try {
    const result = await axios.get("fetchCctv");
    return result;
  } catch (err) {
    return err;
  }
};

export const fetchCctvStreams = async () => {
  try {
    const result = await axios.get("fetchCctvStreams");
    return result;
  } catch (err) {
    return err;
  }
};
