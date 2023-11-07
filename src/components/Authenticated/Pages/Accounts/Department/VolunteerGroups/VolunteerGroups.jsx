import { message } from "antd";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { PlusIcon } from "../../../../../../assets/icons/Icons";
import { getVolunteerGroups } from "../../../../../../store/api/resources-api";
import Button from "../../../../../UI/Button/Button";
import VolunteerGroupsForm from "./Drawer/VolunteerGroupsForm";
import List from "./List";

const VolunteerGroups = () => {
  const [mode, setMode] = useState(false);
  const [volunteerGroups, setVolunteerGroups] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  const fetchVolunteerGroups = async () => {
    setFetchLoading(true);
    const request = await getVolunteerGroups();

    if (!request || request.name === "AxiosError") {
      message.error(request?.response.data.message);
    } else {
      setVolunteerGroups(request.data);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    fetchVolunteerGroups();
  }, []);
  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - Volunteer Groups</title>
      </Helmet>

      <VolunteerGroupsForm
        mode={mode}
        onClose={() => setMode(null)}
        reloadTable={fetchVolunteerGroups}
      />
      <div className="bg-white rounded w-full h-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Volunteer Groups</span>
          <Button
            text="Add"
            type="primary"
            Icon={PlusIcon}
            onClick={() => setMode("adding")}
          />
        </div>
        <div className="w-full h-full">
          <List
            data={volunteerGroups}
            isLoading={fetchLoading}
            selectVolunteerGroup={(e) => setMode(e)}
          />
        </div>
      </div>
    </>
  );
};

export default VolunteerGroups;
