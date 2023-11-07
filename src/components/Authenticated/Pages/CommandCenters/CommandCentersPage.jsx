import { message } from "antd";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { PlusIcon } from "../../../../assets/icons/Icons";
import { getCommandCenters } from "../../../../store/api/adminFn-api";
import Button from "../../../UI/Button/Button";
import CommandCenterForm from "./Drawer/CommandCenterForm";
import List from "./List";
import { useDispatch, useSelector } from "react-redux";
import { resourcesActions } from "../../../../store/store";

const { setCommandCenters } = resourcesActions;

const CommandCentersPage = () => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState(false);
  const { commandCenters } = useSelector((state) => state.resources);
  const [fetchLoading, setFetchLoading] = useState(false);

  const fetchCommandCenters = async () => {
    setFetchLoading(true);
    const request = await getCommandCenters();

    if (!request || request.name === "AxiosError") {
      message.error(request?.response.data.message);
    } else {
      dispatch(setCommandCenters(request.data));
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    if (commandCenters.length === 0) fetchCommandCenters();
  }, [commandCenters.length]);
  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - Command Centers</title>
      </Helmet>

      <CommandCenterForm
        mode={mode}
        onClose={() => setMode(null)}
        reloadTable={fetchCommandCenters}
      />
      <div className="bg-white rounded w-full h-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">
            Command Center Instances
          </span>
          <Button
            text="Create Instance"
            type="primary"
            Icon={PlusIcon}
            onClick={() => setMode("adding")}
          />
        </div>
        <div className="w-full h-full">
          <List
            data={commandCenters}
            isLoading={fetchLoading}
            selectCommandCenterInstance={(e) => setMode(e)}
          />
        </div>
      </div>
    </>
  );
};
export default CommandCentersPage;
