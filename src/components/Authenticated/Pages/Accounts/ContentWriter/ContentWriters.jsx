import { Table } from "ant-table-extensions";
import { Drawer, Form, Select, Tag, message } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { PlusIcon } from "../../../../../assets/icons/Icons";
import { searchFunction } from "../../../../../helpers/searchFunction";
import { resourcesActions } from "../../../../../store/store";
import {
  default as ActionButton,
  default as Button,
} from "../../../../UI/Button/Button";
import MenuButton from "../../../../UI/Menu/MenuButton";
import ContentWriterForm from "./ContentWriterForm";
import { useState } from "react";
import { getCommandCenters } from "../../../../../store/api/adminFn-api";
const {
  fetchResources,
  deactivateAccount,
  reactivateAccount,
  setMode,
  setSelectedAccount,
  setCommandCenters,
} = resourcesActions;

const ContentWriters = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [selectedCc, setSelectedCc] = useState(null);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const closeDrawerHandler = () => {
    dispatch(setMode(false));
  };

  const openDrawerHandler = (e) => {
    dispatch(setMode(e));
    if (e !== "adding") dispatch(setSelectedAccount(e));
  };
  const resources = useSelector((state) => state.resources);
  const { token } = useSelector((state) => state.auth);
  const {
    contentWriters,
    isLoading,
    mode,
    updateLoading,
    selectedAccount,
    addLoading,
    commandCenters,
  } = resources;

  const deactivateAccountHandler = (e) => {
    dispatch(deactivateAccount({ listType: "contentWriters", accountId: e }));
  };

  const reactivateAccountHandler = (e) => {
    dispatch(reactivateAccount({ listType: "contentWriters", accountId: e }));
  };

  useEffect(() => {
    if (token)
      dispatch(
        fetchResources({ toFetch: ["contentWriters"], existing: resources })
      );
  }, [token]);

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
    if (commandCenters.length === 0 && currentUser.accountType === "superadmin")
      fetchCommandCenters();
  }, [commandCenters.length]);

  const columns = [
    ...(currentUser === "admin"
      ? [
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
                    onClick={() => deactivateAccountHandler(d.accountId)}
                  />
                )}
                {d.isDeleted === 1 && (
                  <ActionButton
                    type="menu"
                    text="Reactivate"
                    onClick={() => reactivateAccountHandler(d.accountId)}
                  />
                )}
              </MenuButton>
            ),
          },
        ]
      : []),

    {
      title: "Account ID",
      dataIndex: "accountId",
    },
    {
      title: "Name",
      dataIndex: null,
      render: (d) => `${d.firstName} ${d.lastName}`,
    },
    {
      title: "Mobile Number",
      dataIndex: "contactNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
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
        <title>Defensys | Accounts - ContentWriters</title>
      </Helmet>
      <div className="bg-white rounded w-full h-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">ContentWriters</span>
          {currentUser.accountType === "admin" && (
            <Button
              text="Add"
              type="primary"
              Icon={PlusIcon}
              onClick={() => openDrawerHandler("adding")}
            />
          )}
        </div>
        {currentUser.accountType === "superadmin" && (
          <div className="pt-3 pb-2">
            <Select
              placeholder="Select command center"
              loading={fetchLoading}
              className="min-w-[400px]"
              value={selectedCc}
              onChange={(e) => setSelectedCc(e)}
            >
              <Select.Option>
                {selectedCc ? "Select all" : "Select command center to filter"}
              </Select.Option>
              {commandCenters.map((cc) => (
                <Select.Option
                  key={cc.commandCenterId}
                  value={cc.commandCenterId}
                >
                  {cc.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        )}
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
            }}
            rowKey={"accountId"}
            columns={columns}
            loading={isLoading}
            dataSource={contentWriters.filter(
              (d) => !selectedCc || d.commandCenterId === selectedCc
            )}
            scroll={{ y: "60vh", x: "100vw" }}
          />
        </div>
      </div>
      <Drawer
        placement="right"
        title={
          mode !== "adding"
            ? "Edit Dispatcher Information"
            : "Create a New Dispatcher Account"
        }
        onClose={closeDrawerHandler}
        open={!!mode}
        width={"400px"}
        footer={
          <div className="w-full flex flex-row justify-end">
            <Button
              loading={updateLoading || addLoading}
              text={mode !== "adding" ? "Update Account" : "Create Account"}
              type="primary"
              onClick={() => form.submit()}
            />
          </div>
        }
      >
        {mode === "adding" && <ContentWriterForm form={form} type="add" />}
        {!!mode && mode !== "adding" && (
          <ContentWriterForm
            form={form}
            type="edit"
            selectedAccount={selectedAccount}
          />
        )}
      </Drawer>
    </>
  );
};

export default ContentWriters;
