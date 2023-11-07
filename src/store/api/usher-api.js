import defaultAxios from "axios";
const axios = defaultAxios.create({
  baseURL: import.meta.env.VITE_USHER_BASE_URL + `/prod/`,
});

export const fetchToken = async () => {
  const body = {
    grant_type: import.meta.env.VITE_USHER_GRANT_TYPE,
    client_id: import.meta.env.VITE_USHER_CLIENT_ID,
    client_secret: import.meta.env.VITE_USHER_CLIENT_SECRET,
  };
  try {
    const result = await axios.post("oauth/token", body, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    return result;
  } catch (err) {
    return err;
  }
};

export const fetchData = async (token) => {
  try {
    const result = await axios.get("/api/warning/getAllWarning", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    return result;
  } catch (err) {
    return err;
  }
};
