// import { getStore } from "../../../helpers/injectStore";
import { getStore } from "../../helpers/injectedStore";

import axios from "axios";

export const defaultAxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export const axiosMultipart = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

axiosMultipart.interceptors.request.use(async function (config) {
  const store = getStore();
  config.headers.Authorization = `Bearer ${store.getState().auth.token}`;
  return config;
});
defaultAxios.interceptors.request.use(async function (config) {
  const store = getStore();
  config.headers.Authorization = `Bearer ${store.getState().auth.token}`;
  return config;
});

export const createNews = async ({ body }) => {
  try {
    const result = await axiosMultipart.post(`/api/commandcenter/resources/createNews`, body);
    return result;
  } catch (err) {
    return err;
  }
};
export const getNews = async (body) => {
  try {
    const result = await defaultAxios.get(`/api/commandcenter/resources/fetchNews`, body);
    return result;
  } catch (err) {
    return err;
  }
};
export const getNewsPublic = async (body) => {
  try {
    const result = await defaultAxios.get(`/api/commandcenter/resources/fetchNews`, body);
    // const result = await defaultAxios.get(`/api/web/public/fetchNews`, body);
    return result;
  } catch (err) {
    return err;
  }
};

export const removeNews = async ({ params }) => {
  try {
    const result = await defaultAxios.get(`/api/commandcenter/resources/deleteNews/` + params);
    return result;
  } catch (err) {
    return err;
  }
};

export const updateNews = async ({ params, body }) => {
  try {
    const result = await axiosMultipart.post(`/api/commandcenter/resources/editNews/` + params, body);
    return result;
  } catch (err) {
    return err;
  }
};

export const removeContent = async ({ params, body }) => {
  try {
    const result = await defaultAxios.get(`/api/commandcenter/resources/deleteContent/` + params);
    return result;
  } catch (err) {
    return err;
  }
};
export const addContent = async ({ params, body }) => {
  try {
    const result = await axiosMultipart.post(`/api/commandcenter/resources/addContent`, body);
    return result;
  } catch (err) {
    return err;
  }
};

export const editContent = async ({ params, body }) => {
  try {
    const result = await axiosMultipart.post(`/api/commandcenter/resources/editContent`, body);
    return result;
  } catch (err) {
    return err;
  }
};
