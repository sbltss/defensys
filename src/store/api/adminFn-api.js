import defaultAxios from "axios";
import { getStore } from "../../helpers/injectedStore";
const axios = defaultAxios.create({
  baseURL: import.meta.env.VITE_BASE_URL + `/api/commandcenter/adminFn/`,
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

export const getCommandCenters = async () => {
  try {
    const result = await axios.get("getCommandCenters");
    return result;
  } catch (err) {
    return err;
  }
};

export const createCommandCenterInstance = async (payload) => {
  try {
    const result = await axios.post(
      "createCommandCenterInstance",
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const updateCommandCenter = async (payload) => {
  try {
    const result = await axios.post(
      "updateCommandCenter/" + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const getAdminAccounts = async (payload) => {
  try {
    const result = await axios.get("getAdminAccounts");
    return result;
  } catch (err) {
    return err;
  }
};

export const createAdminAccount = async (payload) => {
  try {
    const result = await axios.post("createAdminAccount", payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const updateAdminAccounts = async (payload) => {
  try {
    const result = await axios.post(
      "updateAdminAccounts/" + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const getApplicants = async () => {
  try {
    const result = await axios.get("getApplicants");
    return result;
  } catch (err) {
    return err;
  }
};

export const rejectApplicant = async (payload) => {
  try {
    const result = await axios.post("rejectApplicant", payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const approvedApplicant = async (payload) => {
  try {
    const result = await axios.get("approvedApplicant/" + payload.param);
    return result;
  } catch (err) {
    return err;
  }
};

export const approveRtPayment = async (payload) => {
  try {
    const result = await axios.post(
      "approveRtPayment/" + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const rejectRtPayment = async (payload) => {
  try {
    const result = await axios.post(
      "rejectRtPayment/" + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};
