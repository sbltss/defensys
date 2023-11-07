import { Drawer, message } from "antd";
import React from "react";
import Button from "../../../UI/Button/Button";
import Lguform from "./Forms/LguForm";
import { useState } from "react";
import { fetchDirectories } from "../../../../store/api/resources-api";
import { useEffect } from "react";
import DirectoryList from "./DirectoryList";

const DirectoryDrawer = ({ mode, setMode, form, reload, currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [directories, setDirectories] = useState([]);

  const fetchDirectoriesHandler = async (cityId) => {
    const request = await fetchDirectories({ param: cityId });
    if (request.name === "AxiosError")
      message.error(request.response.data.message);
    else {
      setDirectories(request.data);
    }
  };

  useEffect(() => {
    if (mode?.cityId) fetchDirectoriesHandler(mode.cityId);
    else setDirectories([]);
  }, [mode]);

  return (
    <Drawer
      placement="bottom"
      title={mode !== "add" ? "Edit Lgu Info" : "Add a New Lgu"}
      onClose={() => setMode(null)}
      open={!!mode}
      height={"95vh"}
      footer={
        <div className="w-full flex flex-row justify-end">
          {currentUser.accountType === "superadmin" && (
            <Button
              loading={loading}
              text={mode !== "add" ? "Update LGU" : "Add new LGU"}
              type="primary"
              onClick={() => form.submit()}
            />
          )}
        </div>
      }
    >
      <div className="flex flex-row flex-wrap gap-2">
        <div className="max-w-[600px] w-full">
          <Lguform
            currentUser={currentUser}
            form={form}
            mode={mode}
            setMode={setMode}
            reload={reload}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
        <div className="flex-1">
          {mode?.cityId && (
            <DirectoryList
              directories={directories}
              setDirectories={setDirectories}
              cityId={mode?.cityId}
            />
          )}
          {!mode?.cityId && (
            <span className="text-xl font-semibold text-gray-800">
              Register LGU to add directories
            </span>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default DirectoryDrawer;
