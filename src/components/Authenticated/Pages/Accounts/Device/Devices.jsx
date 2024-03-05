import { Table } from "ant-table-extensions";
import { Drawer, Form } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { PlusIcon } from "../../../../../assets/icons/Icons";
import { searchFunction } from "../../../../../helpers/searchFunction";
import { resourcesActions } from "../../../../../store/store";
import Badge from "../../../../UI/Badge/Badge";
import {
  default as ActionButton,
  default as Button,
} from "../../../../UI/Button/Button";
import MenuButton from "../../../../UI/Menu/MenuButton";
import DeviceForm from "./DeviceForm";

const {
  fetchResources,
  setMode,
  deactivateAccount,
  reactivateAccount,
  setSelectedAccount,
} = resourcesActions;
const Devices = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const resources = useSelector((state) => state.resources);
  const {
    isLoading,
    mode,
    updateLoading,
    selectedAccount,
    addLoading,
    deviceList,
  } = resources;
  const closeDrawerHandler = () => {
    dispatch(setMode(false));
  };

  const openDrawerHandler = (e) => {
    dispatch(setMode(e));
    if (e !== "adding") dispatch(setSelectedAccount(e));
  };

  const deactivateAccountHandler = (e) => {
    dispatch(deactivateAccount({ listType: "deviceList", accountId: e }));
  };

  const reactivateAccountHandler = (e) => {
    dispatch(reactivateAccount({ listType: "deviceList", accountId: e }));
  };
  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    if (token)
      dispatch(
        fetchResources({ toFetch: ["deviceList"], existing: resources })
      );
  }, [token]);
  const addHandler = () => {
    alert("adding");
  };

  const columns = [
    {
      title: "Action",
      dataIndex: null,
      render: (d) => (
        <MenuButton type="primary" text="Action">
          <ActionButton
            type="menu"
            text="Edit"
            onClick={() => openDrawerHandler(d)}
          />
          {d.isDeleted === 0 && (
            <ActionButton
              type="menu"
              text="Deactivate"
              onClick={() => deactivateAccountHandler(d.macAddress)}
            />
          )}
          {d.isDeleted === 1 && (
            <ActionButton
              type="menu"
              text="Reactivate"
              onClick={() => reactivateAccountHandler(d.macAddress)}
            />
          )}
        </MenuButton>
      ),
    },
    {
      title: "Status",
      dataIndex: "isDeleted",
      render: (d) => (
        <Badge
          type={d === 0 ? "active" : "deactivated"}
          text={d === 0 ? "Active" : "Deactivated"}
        />
      ),
      defaultSortOrder: "ascend",
      sorter: (a, b) =>
        a.isDeleted.toString().localeCompare(b.isDeleted.toString()),
    },
    {
      title: "Mac Address",
      dataIndex: "macAddress",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Location",
      dataIndex: "location",
    },
    {
      title: "Coordinates",
      dataIndex: null,
      render: (d) => `Latitude: ${d.latitude}, Longitude: ${d.longitude}`,
    },
    {
      title: "Date Updated",
      dataIndex: "dateUpdated",
      render: (data) => moment(data).format("lll"),
    },
  ];
  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - Devices</title>
      </Helmet>
      <div className="bg-white rounded w-full h-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Devices</span>
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
              showTotal: (total, range) => `Showing ${range[1]} of ${total} records`,
              showSizeChanger: true,
              defaultPageSize: 10,
              pageSizeOptions: [10, 20, 50, 100],
            }}
            rowKey={"macAddress"}
            columns={columns}
            loading={isLoading}
            dataSource={deviceList}
            scroll={{ y: "60vh", x: "100vw" }}
          />
        </div>
      </div>
      <Drawer
        placement="right"
        title={
          mode !== "adding" ? "Edit Device Information" : "Create a New Device"
        }
        onClose={closeDrawerHandler}
        open={!!mode}
        width={"400px"}
        footer={
          <div className="w-full flex flex-row justify-end">
            <Button
              loading={updateLoading || addLoading}
              text={mode !== "adding" ? "Update Device" : "Create Device"}
              type="primary"
              onClick={() => form.submit()}
            />
          </div>
        }
      >
        {mode === "adding" && <DeviceForm form={form} type="add" />}
        {!!mode && mode !== "adding" && (
          <DeviceForm
            form={form}
            type="edit"
            selectedAccount={selectedAccount}
          />
        )}
      </Drawer>
    </>
  );
};

export default Devices;
