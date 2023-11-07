import { message } from "antd";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { getAppVersions } from "../../../../store/api/resources-api";
import AppVersionForm from "./Drawer/AppVersionForm";
import List from "./List";

const AppVersionsPage = () => {
  const [mode, setMode] = useState(false);
  const [versions, setVersions] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  const fetchVersions = async () => {
    setFetchLoading(true);
    const request = await getAppVersions();
    if (request.name) {
      message.error(request?.response.data.message);
    } else {
      setVersions(request.data);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - App Versions</title>
      </Helmet>

      <AppVersionForm
        mode={mode}
        onClose={() => setMode(null)}
        reloadTable={fetchVersions}
      />
      <div className="bg-white rounded w-full h-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">App Versions</span>
          {/* <Button
        text="Create Instance"
        type="primary"
        Icon={PlusIcon}
        onClick={() => setMode("adding")}
      /> */}
        </div>
        <div className="w-full h-full">
          <List
            data={versions}
            isLoading={fetchLoading}
            selectVersion={(e) => setMode(e)}
          />
        </div>
      </div>
    </>
  );
};

export default AppVersionsPage;
