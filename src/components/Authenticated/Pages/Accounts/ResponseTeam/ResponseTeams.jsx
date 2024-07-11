import { Table } from "ant-table-extensions";
import { Drawer, Form, Select, Tag, message } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import UseFirebaseDB from "../../../../../Hooks/use-firebasedb";
import { MapIcon, PlusIcon } from "../../../../../assets/icons/Icons";
import { searchFunction } from "../../../../../helpers/searchFunction";
import { resourcesActions } from "../../../../../store/store";
import {
  default as ActionButton,
  default as Button,
} from "../../../../UI/Button/Button";
import MenuButton from "../../../../UI/Menu/MenuButton";
import LocationDrawer from "./LocationDrawer";
import ResponseTeamForm from "./ResponseTeamForm";
import { getCommandCenters } from "../../../../../store/api/adminFn-api";
import PaymentReviewDrawer from "./PaymentReviewDrawer";
const {
  fetchResources,
  setMode,
  deactivateAccount,
  reactivateAccount,
  setSelectedAccount,
  setCommandCenters,
  updateRtPayment,
} = resourcesActions;

const ResponseTeams = () => {
  const { socket } = useSelector((state) => state.auth);
  const [viewRt, setViewRt] = useState();
  const [peerConnections] = UseFirebaseDB("peerConnections");
  const [selectedCc, setSelectedCc] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [locations] = UseFirebaseDB("location");
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fetchLoading, setFetchLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);
  const resources = useSelector((state) => state.resources);
  const [paymentReview, setPaymentReview] = useState(null);
  useEffect(() => {
    if (socket) {
      socket.on("newRtPayment", async (data) => {
        dispatch(updateRtPayment(data));
      });
    }
    return () => {
      if (socket) {
        socket.off("newRtPayment");
      }
    };
  }, [socket]);

  const {
    departmentList,
    isLoading,
    mode,
    updateLoading,
    selectedAccount,
    addLoading,
    responseTeamsList,
    commandCenters,
  } = resources;

  useEffect(() => {
    if (!selectedCc) setSelectedDept(null);
  }, [selectedCc]);

  useEffect(() => {
    dispatch(
      fetchResources({ toFetch: ["responseTeamsList"], existing: resources })
    );
  }, []);
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

  const closeDrawerHandler = () => {
    dispatch(setMode(false));
  };

  const openDrawerHandler = (e) => {
    dispatch(setMode(e));
    if (e !== "adding") dispatch(setSelectedAccount(e));
  };

  const deactivateAccountHandler = (e) => {
    dispatch(
      deactivateAccount({ listType: "responseTeamsList", accountId: e })
    );
  };

  const reactivateAccountHandler = (e) => {
    dispatch(
      reactivateAccount({ listType: "responseTeamsList", accountId: e })
    );
  };

  const paymentActionColumn = [
    {
      width: "170px",
      title: "Action",
      dataIndex: null,
      render: (d) => {
        if (
          d?.latestPaymentLog &&
          d.latestPaymentLog.status === "verification"
        ) {
          return (
            <ActionButton
              type="primary"
              text="View Payment"
              onClick={() => setPaymentReview(d)}
            />
          );
        }

        return "-";
      },
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: null,
      render: (d) => `${d.firstName} ${d.lastName}`,
    },
    {
      title: "Status",
      dataIndex: null,
      render: (d) => (
        <div className="flex flex-row gap-2 flex-wrap justify-center items-center">
          {d.isAssigned == "1" ? (
            <Tag color="yellow">Ongoing Case</Tag>
          ) : locations?.[d.accountId]?.isOnline ? (
            <Tag color="Green">Online</Tag>
          ) : (
            <Tag color="red">Offline</Tag>
          )}
          {locations?.[d.accountId] && (
            <ActionButton
              Icon={MapIcon}
              type="primary"
              onClick={() =>
                setViewRt({
                  ...d,
                  lat: locations?.[d.accountId].latitude,
                  lng: locations?.[d.accountId].longitude,
                })
              }
            />
          )}
        </div>
      ),
      defaultSortOrder: "descend",
      sortDirections: ["descend", "ascend", "descend"],

      sorter: (a, b) => {
        let aVal = "";
        let bVal = "";
        if (a.isAssigned) aVal = "Ongoing Case";
        else if (locations?.[a.accountId]?.isOnline) aVal = "Online";
        else aVal = "Offline";

        if (b.isAssigned) bVal = "Ongoing Case";
        else if (locations?.[b.accountId]?.isOnline) bVal = "Online";
        else bVal = "Offline";

        return aVal.toString().localeCompare(bVal.toString());
      },
    },
    {
      title: "Payment Status",
      dataIndex: null,
      render: (data) => {
        if (!data.isVolunteer)
          return (
            <div className="flex justify-center items-center">
              <Tag color="gray">Non-voluntary</Tag>
            </div>
          );
        if (!data?.latestPaymentLog)
          return (
            <div className="flex justify-center items-center">
              <Tag color="gray">Pending</Tag>
            </div>
          );
        else {
          if (data?.latestPaymentLog.status === "rejected")
            return (
              <div className="flex justify-center items-center">
                <Tag color="red">Rejected</Tag>
              </div>
            );
          if (data?.latestPaymentLog.status === "verification")
            return (
              <div className="flex justify-center items-center">
                <Tag color="orange">For Verification</Tag>
              </div>
            );
          if (
            data?.latestPaymentLog.status === "approved" &&
            data?.latestPaymentLog.expiration <
              moment().format("YYYY-MM-DD HH:mm:ss")
          )
            return (
              <div className="flex justify-center items-center">
                <Tag color="red">Expired</Tag>
              </div>
            );
          if (
            data?.latestPaymentLog.status === "approved" &&
            data?.latestPaymentLog.expiration >
              moment().format("YYYY-MM-DD HH:mm:ss")
          )
            return (
              <div className="flex justify-center items-center">
                <Tag color="green">Paid</Tag>
              </div>
            );
        }
      },
      defaultSortOrder: "descend",
      sortDirections: ["descend", "ascend", "descend"],
      sorter: (a, b) => {
        let aVal = "";
        let bVal = "";
        if (!a.isVolunteer) aVal === "Non-voluntary";
        else if (!a.latestPaymentLog) aVal === "pending";
        else if (a.latestPaymentLog.status === "verification")
          aVal = "For Verification";
        else if (a?.latestPaymentLog.status === "rejected") aVal = "rejected";
        else if (
          a.latestPaymentLog.status === "approved" &&
          a.latestPaymentLog.expiration < moment().format("YYYY-MM-DD HH:mm:ss")
        )
          aVal = "Expired";
        else if (
          a.latestPaymentLog.status === "approved" &&
          a.latestPaymentLog.expiration > moment().format("YYYY-MM-DD HH:mm:ss")
        )
          aVal = "Paid";

        if (!b.isVolunteer) bVal === "Non-voluntary";
        else if (!b.latestPaymentLog) bVal === "pending";
        else if (b.latestPaymentLog.status === "verification")
          bVal = "For Verification";
        else if (b?.latestPaymentLog.status === "rejected") bVal = "rejected";
        else if (
          b.latestPaymentLog.status === "approved" &&
          b.latestPaymentLog.expiration < moment().format("YYYY-MM-DD HH:mm:ss")
        )
          bVal = "Expired";
        else if (
          b.latestPaymentLog.status === "approved" &&
          b.latestPaymentLog.expiration > moment().format("YYYY-MM-DD HH:mm:ss")
        )
          bVal = "Paid";

        return aVal.localeCompare(bVal);
      },
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Mobile Number",
      dataIndex: "contactNumber",
    },
    // {
    //   title: "Marker",
    //   dataIndex: "icon",
    //   render: (d) =>
    //     d && (
    //       <img src={import.meta.env.VITE_BASE_URL + "/" + d} alt="marker" />
    //     ),
    // },
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
        <title>Defensys | Accounts - Response Teams</title>
      </Helmet>
      <div className="bg-white rounded w-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Response Teams</span>
          {currentUser.accountType === "department" && (
            <Button
              text="Add"
              type="primary"
              Icon={PlusIcon}
              onClick={() => openDrawerHandler("adding")}
            />
          )}
        </div>
        <PaymentReviewDrawer
          paymentReview={paymentReview}
          onClose={() => setPaymentReview(null)}
        />
        {currentUser.accountType === "superadmin" && (
          <div className="pt-3 pb-2 flex flex-row gap-4">
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
            {selectedCc && (
              <Select
                placeholder="Select department"
                loading={fetchLoading}
                className="min-w-[400px]"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e)}
              >
                <Select.Option>
                  {selectedCc ? "Select all" : "Select department to filter"}
                </Select.Option>
                {departmentList
                  .filter(
                    (d) => d.commandCenterId === selectedCc && d.isDeleted === 0
                  )
                  .map((cc) => (
                    <Select.Option key={cc.accountId} value={cc.accountId}>
                      {cc.name}
                    </Select.Option>
                  ))}
              </Select>
            )}
          </div>
        )}
        <div className="w-full h-full">
          {locations && (
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
              columns={[
                ...(currentUser.accountType === "superadmin"
                  ? paymentActionColumn
                  : []),
                ...(currentUser.accountType === "department"
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
                                onClick={() =>
                                  deactivateAccountHandler(d.accountId)
                                }
                              />
                            )}
                            {d.isDeleted === 1 && (
                              <ActionButton
                                type="menu"
                                text="Reactivate"
                                onClick={() =>
                                  reactivateAccountHandler(d.accountId)
                                }
                              />
                            )}
                          </MenuButton>
                        ),
                      },
                    ]
                  : []),
                ...(currentUser.accountType !== "department"
                  ? [
                      {
                        title: "Department",
                        dataIndex: "departmentName",
                      },
                    ]
                  : []),
                ...columns,
              ]}
              loading={isLoading}
              dataSource={responseTeamsList.filter(
                (d) =>
                  (!selectedCc || d.commandCenterId === selectedCc) &&
                  (!selectedDept || d.departmentId === selectedDept)
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
            ? "Edit Response Team Information"
            : "Create a New Response Team Account"
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
        {mode === "adding" && (
          <ResponseTeamForm
            form={form}
            type="add"
            departmentList={departmentList}
          />
        )}
        {!!mode && mode !== "adding" && (
          <ResponseTeamForm
            form={form}
            type="edit"
            selectedAccount={selectedAccount}
            departmentList={departmentList}
          />
        )}
      </Drawer>
      <LocationDrawer setViewRt={setViewRt} viewRt={viewRt} />
    </>
  );
};

export default ResponseTeams;
