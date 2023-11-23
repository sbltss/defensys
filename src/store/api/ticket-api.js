import defaultAxios from "axios";
import { message } from "antd";
import { getStore } from "../../helpers/injectedStore";
const axios = defaultAxios.create({
  baseURL: import.meta.env.VITE_BASE_URL + `/api/commandcenter/tickets/`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});
const axiosFile = defaultAxios.create({
  baseURL: import.meta.env.VITE_BASE_URL + `/api/commandcenter/tickets/`,
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

axiosFile.interceptors.request.use(async function (config) {
  const store = getStore();
  config.headers.Authorization = `Bearer ${store.getState().auth.token}`;
  return config;
});

axiosFile.interceptors.response.use(
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

export const getOfflineReports = async () => {
  try {
    const result = await axios.get(`getOfflineReports`);
    return result;
  } catch (err) {
    return err;
  }
};

export const resolveTicket = async (payload) => {
  try {
    const result = await axios.post(`resolveTicket`, payload?.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const getChatNotif = async () => {
  try {
    const result = await axios.get(`getChatNotif`);
    return result;
  } catch (err) {
    return err;
  }
};

export const getTicketNotif = async () => {
  try {
    const result = await axios.get(`getTicketNotif`);
    return result;
  } catch (err) {
    return err;
  }
};

export const readTicket = async (param) => {
  try {
    const result = await axios.get(`readEmergencyTicket/${param}`);
    return result;
  } catch (err) {
    return err;
  }
};

export const unreadTicket = async (param) => {
  try {
    const result = await axios.get(`unreadEmergencyTicket/${param}`);
    return result;
  } catch (err) {
    return err;
  }
};

export const getPendingTickets = async (body) => {
  try {
    const result = await axios.get("getPendingEmergencyTickets", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const getAcceptedTickets = async () => {
  try {
    const result = await axios.get("getAcceptedEmergencyTickets");
    return result;
  } catch (err) {
    return err;
  }
};

export const getReportedTickets = async (body) => {
  try {
    const result = await axios.get("getReportedEmergencyTickets", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const getDeclinedTickets = async (body) => {
  try {
    const result = await axios.get("getDeclinedEmergencyTickets", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const getTransferredTickets = async (body) => {
  try {
    const result = await axios.get("getTransferredEmergencyTickets", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const getReportByDate = async (body) => {
  try {
    const result = await axios.post("getReportByDate", body);
    return result;
  } catch (err) {
    return err;
  }
};

export const getReportData = async (param) => {
  try {
    const result = await axios.get(`createReport/${param}`);
    return result;
  } catch (err) {
    return err;
  }
};

export const assignToDepartment = async (payload) => {
  try {
    const result = await axios.post(
      `assignToDepartments/${payload.param}`,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const reportTicket = async (payload) => {
  try {
    const result = await axios.post(
      `reportTicket/${payload.param}`,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const getAssignedDepartments = async (payload) => {
  try {
    const result = await axios.get(`getAssignedDepartments/` + payload);
    return result;
  } catch (err) {
    return err;
  }
};

export const getAssignedResponseTeams = async (payload) => {
  try {
    const result = await axios.post(
      `getAssignedResponseTeams/` + payload.param,
      payload.body || {}
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const assignToResponseTeam = async (payload) => {
  try {
    const result = await axios.post(`assignToResponseTeam`, payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const acceptTicket = async (payload) => {
  try {
    const result = await axios.get(`acceptTicket/` + payload.param);
    return result;
  } catch (err) {
    return err;
  }
};

export const declineTicket = async (payload) => {
  try {
    const result = await axios.post(
      `declineTicket/` + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const addUpdate = async (payload) => {
  try {
    const result = await axiosFile.post(`addUpdate`, payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const removeImageUpdate = async (payload) => {
  try {
    const result = await axios.post(
      `removeImageUpdate/` + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const editUpdate = async (payload) => {
  try {
    const result = await axiosFile.post(
      `editUpdate/` + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const getUpdates = async (payload) => {
  const queries = payload.queries || {};
  const queryText = Object.keys(queries)
    .filter((q) => queries[q] !== undefined)
    .map((q) => `${q}=${queries[q]}`)
    .join("&");
  try {
    const result = await axios.get(
      `getUpdates/` + payload.param + (queryText ? `?${queryText}` : "")
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const createEmergencyTicket = async (payload) => {
  try {
    const result = await axiosFile.post(`createEmergencyTicket`, payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const tagCitizenToTicket = async (payload) => {
  try {
    const result = await axios.post(`tagCitizenToTicket`, payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const transferTicket = async (payload) => {
  try {
    const result = await axios.post(`transferTicket`, payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const cancelTransferredTicket = async (payload) => {
  try {
    const result = await axios.get(`cancelTransferredTicket/` + payload.param);
    return result;
  } catch (err) {
    return err;
  }
};

export const acceptTransferredTicket = async (payload) => {
  try {
    const result = await axios.get(`acceptTransferredTicket/` + payload.param);
    return result;
  } catch (err) {
    return err;
  }
};

export const declineTransferredTicket = async (payload) => {
  try {
    const result = await axios.get(`declineTransferredTicket/` + payload.param);
    return result;
  } catch (err) {
    return err;
  }
};

export const getReportsOfTheDay = async () => {
  try {
    const result = await axios.get(`getReportsOfTheDay`);
    return result;
  } catch (err) {
    return err;
  }
};

export const getArchivedReportsOfTheDay = async () => {
  try {
    const result = await axios.get(`getArchivedReportsOfTheDay`);
    return result;
  } catch (err) {
    return err;
  }
};

export const getSupervisorTickets = async () => {
  try {
    const result = await axios.get(`getSupervisorTickets`);
    return result;
  } catch (err) {
    return err;
  }
};

export const addReportOfTheDay = async (payload) => {
  try {
    const result = await axios.post(`addReportOfTheDay`, payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const updateTicketReportOfTheDay = async (payload) => {
  try {
    const result = await axios.post(
      `updateTicketReportOfTheDay/` + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const tagOfflineReport = async (payload) => {
  try {
    const result = await axios.post(`tagOfflineReport/`, payload.body);
    return result;
  } catch (err) {
    return err;
  }
};

export const rejectOfflineReport = async (payload) => {
  try {
    const result = await axios.get(`rejectOfflineReport/` + payload.param);
    return result;
  } catch (err) {
    return err;
  }
};

export const updateHazardNote = async (payload) => {
  try {
    const result = await axios.post(
      `updateHazardNote/` + payload.param,
      payload.body
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const addReportEntry = async (payload) => {
  try {
    const result = await axiosFile.post(`addReportEntry`, payload.body);
    return result;
  } catch (err) {
    return err;
  }
};
