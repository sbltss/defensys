import defaultAxios from "axios";
import { getStore } from "../../helpers/injectedStore";

const axios = defaultAxios.create({
  baseURL: import.meta.env.VITE_BASE_URL + `/api/commandcenter/auth/`,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

export const login = async (body) => {
  try {
    const result = await axios.post("login", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const dgsiLogin = async (body) => {
  try {
    const result = await axios.post("dgsiLogin", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const sendOtp = async (body) => {
  try {
    const result = await axios.post("sendOtp", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const submitOtp = async (body) => {
  try {
    const result = await axios.post("submitOtp", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const changePassword = async (body) => {
  try {
    const result = await axios.post("changePassword", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const changePasswordWithToken = async (payload) => {
  try {
    const store = getStore();
    const result = await axios.post("changePasswordWithToken", payload.body, {
      headers: { Authorization: `Bearer ${store.getState().auth.token}` },
    });
    return result;
  } catch (err) {
    return err;
  }
};

export const changePasswordWithTokenV2 = async (payload) => {
  try {
    const store = getStore();
    const result = await axios.post("changePasswordWithTokenV2", payload.body, {
      headers: { Authorization: `Bearer ${store.getState().auth.token}` },
    });
    return result;
  } catch (err) {
    return err;
  }
};

export const sendWriterRegOtp = async (payload) => {
  try {
    const result = await axios.post("sendWriterRegOtp", payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const submitWriterRegOtp = async (payload) => {
  try {
    const result = await axios.post("submitWriterRegOtp", payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const contentWriterRegistration = async (payload) => {
  try {
    const result = await axios.post("contentWriterRegistration", payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const demoLogin = async (body) => {
  try {
    const result = await axios.post("demoLogin", body);
    return result;
  } catch (err) {
    return err;
  }
};
