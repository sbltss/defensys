import defaultAxios from "axios";
import { getStore } from "../../helpers/injectedStore";
const axios = defaultAxios.create({
  baseURL: import.meta.env.VITE_BASE_URL + `/api/commandcenter/subscription/`,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

axios.interceptors.request.use(async function (config) {
  const store = getStore();
  config.headers.Authorization = `Bearer ${store.getState().auth.token}`;
  return config;
});

export const getBatchSubscriptions = async () => {
  try {
    const result = await axios.get("getBatchSubscriptions");
    return result;
  } catch (err) {
    return err;
  }
};

export const fetchSubscriptionPlans = async () => {
  try {
    const result = await axios.get("fetchSubscriptionPlans");
    return result;
  } catch (err) {
    return err;
  }
};

export const addPlan = async (payload) => {
  try {
    const result = await axios.post("addPlan", payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const updatePlan = async (payload) => {
  try {
    const result = await axios.post(
      "updatePlan/" + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const addBatchSubscriptions = async (payload) => {
  try {
    const result = await axios.post("addBatchSubscriptions", payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const approveBatchSubscription = async (payload) => {
  try {
    const result = await axios.post(
      "approveBatchSubscription/" + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const rejectedBatchSubscription = async (payload) => {
  try {
    const result = await axios.post(
      "rejectedBatchSubscription/" + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};
