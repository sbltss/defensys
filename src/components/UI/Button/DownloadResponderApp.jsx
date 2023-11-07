import React from "react";
import { message } from "antd";
import { getAppVersions } from "../../../store/api/resources-api";
import { useState } from "react";
import { useEffect } from "react";

const DownloadResponderApp = () => {
  const [appUrl, setAppUrl] = useState(null);
  const fetchAppUrl = async () => {
    const request = await getAppVersions();

    if (request.name === "AxiosError") {
      message.error(request.response.data.message);
    } else {
      const apps = request.data;
      setAppUrl(
        apps.filter(
          (app) => app.platform === "android" && app.type === "responseTeam"
        )[0].directLink
      );
    }
  };

  useEffect(() => {
    fetchAppUrl();
  }, []);

  if (appUrl)
    return (
      <div
        onClick={() => window.open(appUrl, "_blank")}
        className="flex flex-row"
      >
        {/* <DownloadIcon /> */}
        <span>Download Responder App</span>
      </div>
    );
  else null;
};

export default DownloadResponderApp;
