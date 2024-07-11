import { Table } from "ant-table-extensions";
import { Drawer, Form } from "antd";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { searchFunction } from "../../../../../helpers/searchFunction";
import { resourcesActions } from "../../../../../store/store";
import { PlusIcon } from "../../../../../assets/icons/Icons";
import CaseTypeForm from "./CaseTypeForm";
import MenuButton from "../../../../UI/Menu/MenuButton";
import {
  default as ActionButton,
  default as Button,
} from "../../../../UI/Button/Button";
const { fetchResources, setMode, setSelectedAccount, deactivateCaseType } =
  resourcesActions;

const CaseTypes = () => {
  const dispatch = useDispatch();
  const resources = useSelector((state) => state.resources);
  const { token } = useSelector((state) => state.auth);
  const {
    mode,
    caseTypes,
    isLoading,
    updateLoading,
    addLoading,
    selectedAccount,
  } = resources;
  const [form] = Form.useForm();
  const closeDrawerHandler = () => {
    dispatch(setMode(false));
  };
  const openDrawerHandler = (e) => {
    dispatch(setMode(e));
    if (e !== "adding") dispatch(setSelectedAccount(e));
  };

  const deactivateCaseTypeHandler = (e) => {
    dispatch(deactivateCaseType({ listType: "deactivateCaseType", id: e }));
  };

  useEffect(() => {
    if (token)
      dispatch(fetchResources({ toFetch: ["caseTypes"], existing: resources }));
  }, [token]);
  const addHandler = () => {
    alert("adding");
  };

  const columns = [
    {
      title: "Action",
      dataIndex: null,
      render: (d) =>
        d?.commandCenterId ? (
          <MenuButton type="primary" text="Action">
            <ActionButton
              type="menu"
              text="Edit"
              onClick={() => openDrawerHandler(d)}
            />
            <ActionButton
              type="menu"
              text="Delete"
              onClick={() => deactivateCaseTypeHandler(d.id)}
            />
          </MenuButton>
        ) : (
          "Default Case Types are non-editable."
        ),
    },
    {
      title: "Type ID",
      dataIndex: "id",
    },
    {
      title: "Type Name",
      dataIndex: "typeName",
    },
    {
      title: "Emergency Type",
      dataIndex: "emergencyType",
      render: (d) => (d === 0 ? "Emergency" : "Non-Emergency"),
    },
    {
      title: "Marker",
      dataIndex: "icon",
      render: (d) =>
        d && (
          <img
            src={import.meta.env.VITE_BASE_URL + "/" + d}
            alt="marker"
            className=" w-12"
          />
        ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - CaseTypes</title>
      </Helmet>
      <div className="bg-white rounded w-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Case Types</span>
          <Button
            text="Add"
            type="primary"
            Icon={PlusIcon}
            onClick={() => openDrawerHandler("adding")}
          />
        </div>
        <div className="w-full h-full">
          <Table
            searchableProps={{
              searchFunction: searchFunction,
            }}
            searchable={true}
            pagination={{
              showSizeChanger: true,
              defaultPageSize: 10,
              pageSizeOptions: [10, 20, 50, 100],
              showTotal: (total, range) =>
                `${range[0]} - ${range[1]} of ${total} items`,
            }}
            rowKey={"id"}
            columns={columns}
            loading={isLoading}
            dataSource={caseTypes.filter((e) => e.isDeleted != 1)}
            scroll={{ y: "60vh", x: "100vw" }}
            style={{ marginBottom: "10px" }}
          />
        </div>
      </div>
      <Drawer
        title="Create a Case Type"
        onClose={closeDrawerHandler}
        open={!!mode}
        width={600}
        footer={
          <div className="w-full flex flex-row justify-end">
            <Button
              loading={updateLoading || addLoading}
              text={mode !== "adding" ? "Update Case Type" : "Create Case Type"}
              type="primary"
              onClick={() => form.submit()}
            />
          </div>
        }
      >
        {mode === "adding" && (
          <CaseTypeForm form={form} type="add" resources={resources} />
        )}
        {!!mode && mode !== "adding" && (
          <CaseTypeForm
            form={form}
            type="edit"
            resources={resources}
            selectedAccount={selectedAccount}
          />
        )}
      </Drawer>
    </>
  );
};

export default CaseTypes;
