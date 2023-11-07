import defaultAxios from "axios";

const axios = defaultAxios.create({
  baseURL: import.meta.env.VITE_BASE_URL + `/api/commandcenter/ccPublic/`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});
const axiosFile = defaultAxios.create({
  baseURL: import.meta.env.VITE_BASE_URL + `/api/commandcenter/ccPublic/`,
  headers: {
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*",
  },
});

export const getCaseTypes = async () => {
  try {
    const result = await axios.get("getCaseTypes");
    return result;
  } catch (err) {
    return err;
  }
};

export const createEmergencyTicket = async (body) => {
  try {
    const result = await axiosFile.post("createEmergencyTicket", body);
    return result;
  } catch (err) {
    return err;
  }
};
