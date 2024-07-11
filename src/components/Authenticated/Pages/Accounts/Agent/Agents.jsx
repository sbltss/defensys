import { Table } from "ant-table-extensions";
import { Drawer, Form, Select, Tag, message } from "antd";
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
import AgentForm from "./AgentForm";
import UseFirebaseDB from "../../../../../Hooks/use-firebasedb";
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

const Agents = () => {
  const dispatch = useDispatch();
  const { commandCenters } = useSelector((state) => state.resources);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [selectedCc, setSelectedCc] = useState(null);
  const { currentUser } = useSelector((state) => state.auth);
  const peerConnections = UseFirebaseDB(`peerConnections`);
  const peers = UseFirebaseDB(`${currentUser.commandCenterId}/peers`);
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
    agentList,
    isLoading,
    mode,
    updateLoading,
    selectedAccount,
    addLoading,
  } = resources;

  const deactivateAccountHandler = (e) => {
    dispatch(deactivateAccount({ listType: "agentList", accountId: e }));
  };

  const reactivateAccountHandler = (e) => {
    dispatch(reactivateAccount({ listType: "agentList", accountId: e }));
  };

  useEffect(() => {
    if (token)
      dispatch(fetchResources({ toFetch: ["agentList"], existing: resources }));
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

  const actionCol = {
    title: "Action",
    dataIndex: null,
    render: (d) => (
      <ActionButton
        type="primary"
        text="Edit"
        onClick={() => openDrawerHandler(d)}
      />
      // <MenuButton type="primary" text="Action">
      //   <ActionButton
      //     type="menu"
      //     text="Edit"
      //     onClick={() => openDrawerHandler(d)}
      //   />
      //   {d.isDeleted === 0 && (
      //     <ActionButton
      //       type="menu"
      //       text="Deactivate"
      //       onClick={() => deactivateAccountHandler(d.accountId)}
      //     />
      //   )}
      //   {d.isDeleted === 1 && (
      //     <ActionButton
      //       type="menu"
      //       text="Reactivate"
      //       onClick={() => reactivateAccountHandler(d.accountId)}
      //     />
      //   )}
      // </MenuButton>
    ),
  };
  const columns = [
    {
      width: "200px",
      title: "Status",
      dataIndex: null,
      render: (d) => {
        return (
          <div className="flex items-center gap-1">
            {peerConnections[0]?.includes(d.accountId) && (
              <div className="flex flex-row gap-2">
                <span>Call:</span>
                <Tag
                  color={
                    peers[0]?.[d.accountId]?.status === "ONLINE"
                      ? "green"
                      : "orange"
                  }
                >
                  {peers[0]?.[d.accountId]?.status === "ONCALL"
                    ? "ONGOING CALL"
                    : peers[0]?.[d.accountId]?.status}
                </Tag>
              </div>
            )}
            <div>
              {peerConnections[0]?.includes(d.accountId) ? (
                <Tag color="green">Signed In</Tag>
              ) : (
                <Tag color="default">Signed Out</Tag>
              )}
            </div>
          </div>
        );
      },
      defaultSortOrder: "ascend",
      sorter: (a, b) => {
        let aVal;
        let bVal;

        if (peerConnections[0]?.includes(a.accountId)) {
          aVal = peers[0]?.[a.accountId]?.status;
        } else {
          aVal = peerConnections[0]?.includes(a.accountId)
            ? "Signed In"
            : "Signed Out";
        }
        if (peerConnections[0]?.includes(b.accountId)) {
          bVal = peers[0]?.[b.accountId]?.status;
        } else {
          bVal = peerConnections[0]?.includes(b.accountId)
            ? "Signed In"
            : "Signed Out";
        }
        return aVal.toString().localeCompare(bVal.toString());
      },
    },
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
      // sorter: (a, b) => a.dateUpdated.localeCompare(b.dateUpdated),
      // defaultSortOrder: "descend",
      render: (data) => moment(data).format("lll"),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - Dispatchers</title>
      </Helmet>
      <div className=" bg-white rounded w-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Dispatchers</span>
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
          {peerConnections?.[0] && peers?.[0] && (
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
              rowKey={"accountId"}
              columns={
                currentUser.accountType === "admin"
                  ? [actionCol, ...columns]
                  : columns
              }
              loading={isLoading}
              dataSource={agentList.filter(
                (d) => !selectedCc || d.commandCenterId === selectedCc
              )}
              scroll={{ y: "60vh", x: "100vw" }}
            />
          )}
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
        {mode === "adding" && <AgentForm form={form} type="add" />}
        {!!mode && mode !== "adding" && (
          <AgentForm
            form={form}
            type="edit"
            selectedAccount={selectedAccount}
          />
        )}
      </Drawer>
    </>
  );
};

export default Agents;
