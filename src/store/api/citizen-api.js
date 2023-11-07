import defaultAxios from "axios";
import { message } from "antd";
import { getStore } from "../../helpers/injectedStore";
const axios = defaultAxios.create({
  baseURL: import.meta.env.VITE_BASE_URL + `/api/commandcenter/citizen/`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});
// const axiosFile = defaultAxios.create({
//   baseURL: import.meta.env.VITE_BASE_URL + `/api/commandcenter/ccAdmin/`,
//   headers: {
//     "Content-Type": "multipart/form-data",
//     "Access-Control-Allow-Origin": "*",
//   },
// });

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

export const blockCitizen = async (body) => {
  try {
    const result = await axios.post("blockCitizen", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const getBlockHistory = async (payload) => {
  try {
    const result = await axios.get("getBlockHistory/" + payload.param);
    return result;
  } catch (err) {
    return err;
  }
};

export const searchCitizenByCC = async (body) => {
  try {
    const result = await axios.post("searchCitizenByCC", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const searchCitizen = async (body) => {
  try {
    const result = await axios.post("searchCitizen", body);
    return result;
  } catch (err) {
    return err;
  }
};
