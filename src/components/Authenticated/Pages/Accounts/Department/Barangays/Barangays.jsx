import React, { useEffect, useState } from "react";
import { getBarangays } from "../../../../../../store/api/resources-api";
import { message } from "antd";
import List from "./List";
import { Helmet } from "react-helmet";
import Button from "../../../../../UI/Button/Button";
import { PlusIcon } from "../../../../../../assets/icons/Icons";
import BarangayForm from "./Drawer/BarangayForm";

const Barangays = () => {
  const [mode, setMode] = useState(null);
  const [barangays, setBarangays] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  const fetchBarangays = async () => {
    setFetchLoading(true);
    const request = await getBarangays();

    if (!request || request.name === "AxiosError") {
      message.error(request?.response.data.message);
    } else {
      setBarangays(request.data);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    fetchBarangays();
  }, []);
  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - Barangays</title>
      </Helmet>
      <BarangayForm
        mode={mode}
        onClose={() => setMode(null)}
        reloadTable={fetchBarangays}
      />
      <div className="bg-white rounded w-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Barangays</span>
          <Button
            text="Add"
            type="primary"
            Icon={PlusIcon}
            onClick={() => setMode("adding")}
          />
        </div>
        <div className="w-full h-full">
          <List
            data={barangays}
            isLoading={fetchLoading}
            selectBarangay={(e) => setMode(e)}
          />
        </div>
      </div>
    </>
  );
};

export default Barangays;
