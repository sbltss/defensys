import React, { useEffect } from "react";
import Button from "../../../../../UI/Button/Button";
import { Helmet } from "react-helmet";
import { PlusIcon } from "../../../../../../assets/icons/Icons";
import Types from "./Table/Types";
import { useState } from "react";
import { message } from "antd";
import { deptTypeList } from "../../../../../../store/api/resources-api";
import DeptTypeForm from "./Form/DeptTypeForm";

const DepartmentTypesPage = () => {
  const [types, setTypes] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const fetchTypesHandler = async () => {
    setFetchLoading(true);

    const result = await deptTypeList();
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      setTypes(result.data);
    }

    setFetchLoading(false);
  };

  useEffect(() => {
    fetchTypesHandler();
  }, []);

  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - Department Types</title>
      </Helmet>
      <DeptTypeForm
        adding={adding}
        onClose={() => {
          setSelectedType(null);
          setAdding(false);
        }}
        selectedType={selectedType}
        reload={fetchTypesHandler}
      />
      <div className="bg-white rounded w-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Departments Types</span>
          <Button
            text="Add"
            type="primary"
            Icon={PlusIcon}
            onClick={() => setAdding("adding")}
          />
        </div>
        <div>
          <Types
            fetchLoading={fetchLoading}
            types={types}
            setSelectedType={setSelectedType}
          />
        </div>
      </div>
    </>
  );
};

export default DepartmentTypesPage;
