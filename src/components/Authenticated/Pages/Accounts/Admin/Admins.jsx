import { message } from "antd";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { PlusIcon } from "../../../../../assets/icons/Icons";
import { getAdminAccounts } from "../../../../../store/api/adminFn-api";
import Button from "../../../../UI/Button/Button";
import AdminForm from "./Drawer/AdminForm";
import List from "./List";

const Admins = () => {
  const [mode, setMode] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  const fetchAdminAccounts = async () => {
    setFetchLoading(true);
    const request = await getAdminAccounts();
    if (!request || request.name === "AxiosError") {
      message.error(request?.response.data.message);
    } else {
      setAdmins(request.data);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    fetchAdminAccounts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - Admins</title>
      </Helmet>
      <AdminForm
        mode={mode}
        onClose={() => setMode(null)}
        reloadTable={fetchAdminAccounts}
        admins={admins}
      />
      <div className="bg-white rounded w-full h-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Admins</span>
          <Button
            text="Add"
            type="primary"
            Icon={PlusIcon}
            onClick={() => setMode("adding")}
          />
        </div>
        <div className="w-full h-full">
          <List
            data={admins}
            isLoading={fetchLoading}
            selectAdminAccount={(e) => setMode(e)}
          />
        </div>
      </div>
    </>
  );
};

export default Admins;
