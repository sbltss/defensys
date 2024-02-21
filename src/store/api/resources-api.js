import defaultAxios from "axios";
import { getStore } from "../../helpers/injectedStore";
const axios = defaultAxios.create({
  baseURL: import.meta.env.VITE_BASE_URL + `/api/commandcenter/resources/`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});
const axiosFile = defaultAxios.create({
  baseURL: import.meta.env.VITE_BASE_URL + `/api/commandcenter/resources/`,
  headers: {
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*",
  },
});

axios.interceptors.request.use(async function (config) {
  const store = getStore();
  config.headers.Authorization = `Bearer ${store.getState().auth.token}`;
  return config;
});

axiosFile.interceptors.request.use(async function (config) {
  const store = getStore();
  config.headers.Authorization = `Bearer ${store.getState().auth.token}`;
  return config;
});

export const getAppVersions = async () => {
  try {
    const result = await axios.get("getAppVersions");
    return result;
  } catch (err) {
    return err;
  }
};

export const updateAppVersions = async (payload) => {
  try {
    const result = await axios.post("updateAppVersions", payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const getBarangays = async () => {
  try {
    const result = await axios.get("getBarangays");
    return result;
  } catch (err) {
    return err;
  }
};

export const addBarangay = async (payload) => {
  try {
    const result = await axios.post("addBarangay", payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const updateBarangay = async (payload) => {
  try {
    const result = await axios.post(
      "updateBarangay/" + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const getVolunteerGroups = async () => {
  try {
    const result = await axios.get("getVolunteerGroups");
    return result;
  } catch (err) {
    return err;
  }
};

export const addVolunteerGroup = async (payload) => {
  try {
    const result = await axios.post("addVolunteerGroup", payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const updateVolunteerGroup = async (payload) => {
  try {
    const result = await axios.post(
      "updateVolunteerGroup/" + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const caseTypes = async () => {
  try {
    const result = await axios.get("getCaseTypes");
    return result;
  } catch (err) {
    return err;
  }
};

export const addCaseType = async (payload) => {
  try {
    const result = await axios.post("addCaseType", payload);
    return result;
  } catch (err) {
    return err;
  }
};

export const updateCaseType = async (payload) => {
  try {
    const result = await axios.post(
      "updateCaseType/" + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const deactivateCaseType = async (payload) => {
  try {
    const result = await axios.get("deactivateCaseType/" + payload.param);
    return result;
  } catch (err) {
    return err;
  }
};

export const reportCategory = async () => {
  try {
    const result = await axios.get("getReportCategory");
    return result;
  } catch (err) {
    return err;
  }
};

export const responseTeamsList = async (payload) => {
  const queries = payload?.queries || {};
  const queryText = Object.keys(queries)
    .filter((q) => queries[q] !== undefined)
    .map((q) => `${q}=${queries[q]}`)
    .join("&");
  try {
    const result = await axios.get(
      "getResponseTeams" + (queryText ? `?${queryText}` : "")
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const deviceList = async () => {
  try {
    const result = await axios.get("getDevices");
    return result;
  } catch (err) {
    return err;
  }
};

export const deactivateAccount = async (param) => {
  try {
    const result = await axios.get("deactivateAccount/" + param);
    return result;
  } catch (err) {
    return err;
  }
};

export const reactivateAccount = async (param) => {
  try {
    const result = await axios.get("reactivateAccount/" + param);
    return result;
  } catch (err) {
    return err;
  }
};

export const updateAccount = async (payload) => {
  try {
    const result = await axios.post(
      "updateAccount/" + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const agentList = async () => {
  try {
    const result = await axios.get("getAgents");
    return result;
  } catch (err) {
    return err;
  }
};

export const addAgent = async (body) => {
  try {
    const result = await axios.post("addAgent", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const departmentList = async () => {
  try {
    const result = await axios.get("getDepartments");
    return result;
  } catch (err) {
    return err;
  }
};

export const addDepartment = async (body) => {
  try {
    const result = await axios.post("addDepartment", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const contentWriters = async () => {
  try {
    const result = await axios.get("getContentWriters");
    return result;
  } catch (err) {
    return err;
  }
};

export const addContentWriter = async (body) => {
  try {
    const result = await axios.post("addContentWriter", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const supervisorList = async () => {
  try {
    const result = await axios.get("getSupervisors");
    return result;
  } catch (err) {
    return err;
  }
};

export const addSupervisor = async (body) => {
  try {
    const result = await axios.post("addSupervisor", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const responseTeamList = async () => {
  try {
    const result = await axios.get("getResponseTeams");
    return result;
  } catch (err) {
    return err;
  }
};

export const addResponseTeam = async (body) => {
  try {
    const result = await axios.post("addResponseTeam", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const deactivateDevice = async (param) => {
  try {
    const result = await axios.get("deactivateDevice/" + param);
    return result;
  } catch (err) {
    return err;
  }
};

export const reactivateDevice = async (param) => {
  try {
    const result = await axios.get("reactivateDevice/" + param);
    return result;
  } catch (err) {
    return err;
  }
};

export const updateDevice = async (payload) => {
  try {
    const result = await axios.post(
      "updateDevice/" + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const addDevice = async (body) => {
  try {
    const result = await axios.post("addDevice", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const getSensors = async () => {
  try {
    const result = await axios.get("getSensors");
    return result;
  } catch (err) {
    return err;
  }
};

export const addSensor = async (payload) => {
  try {
    const result = await axios.post("addSensor", payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const updateSensor = async (payload) => {
  try {
    const result = await axios.post(
      "updateSensor/" + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const fetchLgus = async () => {
  try {
    const result = await axios.get("fetchLgus");
    return result;
  } catch (err) {
    return err;
  }
};

export const addLguInfo = async (payload) => {
  try {
    const result = await axios.post("addLguInfo", payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const editLguInfo = async (payload) => {
  try {
    const result = await axios.post(
      "editLguInfo/" + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const fetchDirectories = async (payload) => {
  try {
    const result = await axios.get("fetchDirectories/" + payload.param);
    return result;
  } catch (err) {
    return err;
  }
};

export const addDirectory = async (payload) => {
  try {
    const result = await axios.post("addDirectory", payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const updateDirectory = async (payload) => {
  try {
    const result = await axios.post(
      "updateDirectory/" + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};
export const fetchWeather = async ({ lat, lng }) => {
  try {
    const result = await axios.post(`/getSatelliteWeather`, { lat, lng });
    return result;
  } catch (err) {
    return err;
  }
};

export const fetchForecast = async ({ lat, lng }) => {
  try {
    const result = await axios.post(`/getSatelliteForecast`, { lat, lng });
    return result;
  } catch (err) {
    return err;
  }
};

export const updateCCLogo = async (payload) => {
  try {
    const result = await axiosFile.post(`/updateCCLogo`, payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const fetchCCInfo = async () => {
  try {
    const result = await axiosFile.get(`/fetchCCInfo`);
    return result;
  } catch (err) {
    return err;
  }
};

export const fetchSensorData = async (payload) => {
  try {
    const result = await axios.post(`/fetchSensorData`, payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const fetchSensorArchives = async (payload) => {
  try {
    const result = await axios.post(`/fetchSensorArchives`, payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const deleteArchive = async (payload) => {
  try {
    const result = await axios.post(`/deleteArchive`, payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const deptTypeList = async () => {
  try {
    const result = await axios.get("getAccountTypes");
    return result;
  } catch (err) {
    return err;
  }
};

export const addAccounType = async (payload) => {
  try {
    const result = await axios.post("addAccounType", payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const updateAccountType = async (payload) => {
  try {
    const result = await axios.post(
      "updateAccountType/" + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};
