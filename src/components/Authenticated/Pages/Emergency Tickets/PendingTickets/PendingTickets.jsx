import { Table } from "ant-table-extensions";
import { Tag } from "antd";
import moment from "moment";
import mtz from "moment-timezone";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilters } from "../../../../../helpers";
import { searchFunction } from "../../../../../helpers/searchFunction";
import { ticketsActions } from "../../../../../store/store";
import Badge from "../../../../UI/Badge/Badge";
import Button from "../../../../UI/Button/Button";
import PendingDrawer from "./Drawers/PendingDrawer";

const { selectPendingTicket, readTicket, fetchChatNotifs } = ticketsActions;

const PendingTickets = () => {
  const dispatch = useDispatch();
  const resources = useSelector((state) => state.resources);
  const { caseTypes, agentList } = resources;
  const { currentUser } = useSelector((state) => state.auth);
  const viewTicket = (data) => {
    dispatch(fetchChatNotifs());
    dispatch(selectPendingTicket(data));
    if (data.isRead === 0 && currentUser.accountType === "agent") {
      dispatch(readTicket(data.transactionNumber));
    }
  };
  const { pendingTickets, fetchPendingTicketLoading } = useSelector(
    (state) => state.tickets
  );

  const getTypeName = (id) => {
    return caseTypes?.filter((ct) => +ct.id === +id)[0]?.typeName;
  };

  const columns = [
    {
      width: "150px",
      title: "",
      dataIndex: null,
      render: (data) => {
        if (currentUser.accountType === "agent") {
          if (
            +agentList.length === 0 &&
            !!data.isRead &&
            +data.isRead !== +currentUser.accountId
          )
            return <Button loading={true} text="" type="muted" />;
          const agentName = agentList.filter(
            (agent) => +agent.accountId === +data.isRead
          )[0];
          return (
            <Button
              onClick={() => viewTicket(data)}
              type={!!data.isRead ? "warning" : "primary"}
              text={
                !!data.isRead && +data.isRead !== +currentUser.accountId
                  ? `${agentName?.firstName[0]}. ${agentName?.lastName}`
                  : "View Ticket"
              }
              disabled={
                !!data.isRead && +data.isRead !== +currentUser.accountId
              }
            />
          );
        } else if (currentUser.accountType === "supervisor") {
          const agentName = agentList.filter(
            (agent) => +agent.accountId === +data.isRead
          )[0];
          return (
            <div className="flex flex-col gap-1 justify-center items-center">
              <Button
                onClick={() => viewTicket(data)}
                type={"primary"}
                text={"View Ticket"}
              />
              {agentList.length > 0 && !!data.isRead && (
                <span className="text-xs font-medium text-gray-600">{`${agentName?.firstName[0]}. ${agentName?.lastName}`}</span>
              )}
            </div>
          );
        } else
          return (
            <Button
              onClick={() => viewTicket(data)}
              type={"primary"}
              text={"View Ticket"}
            />
          );
      },
    },
    {
      width: "150px",
      title: "Type",
      dataIndex: "caseType",
      render: (data) => <Badge type="caseType" text={getTypeName(data)} />,
      filters: getFilters(pendingTickets, "caseType", getTypeName),
      onFilter: (value, record) => record.caseType === value,
    },
    {
      width: "150px",
      title: "Created By",
      dataIndex: "createdBy",
    },
    {
      width: "150px",
      title: "Injury",
      dataIndex: "withInjury",
      render: (data) => (
        <div className="flex flex-col items-center">
          <Badge type={data === 0 ? "withoutInjury" : "withInjury"} />
        </div>
      ),
    },
    {
      width: "200px",
      title: "Address",
      dataIndex: "address",
    },
    {
      width: "200px",
      title: "Ticket Number",
      dataIndex: "transactionNumber",
      render: (data) => <nobr>{data}</nobr>,
    },
    {
      width: "200px",
      title: "Citizen",
      dataIndex: null,

      render: (data) => (
        <div className="flex flex-col items-center">
          <span>{`${data.firstName} ${data.lastName}`}</span>
          {!data.callerId && (
            <div>
              <Tag color="red" className="mx-0">
                Non-registered
              </Tag>
            </div>
          )}
          {data?.departmentName || data?.departmentType ? (
            <div>
              <Tag color="red" className="mx-0">
                {data?.departmentType} - {data?.departmentName}
              </Tag>
            </div>
          ) : null}
        </div>
      ),
    },
    {
      width: "130px",
      title: "Caller ID",
      dataIndex: "callerId",
    },
    {
      width: "130px",
      title: "Mobile",
      dataIndex: "mobileNumber",
    },
    {
      width: "100px",
      title: "Date",
      dataIndex: "dateCreated",
      render: (data) => {
        if (data.endsWith("Z")) {
          return mtz(data).tz("utc").format("lll");
        }
        return moment(data).format("lll");
      },

      sorter: (a, b) => {
        return a.dateCreated?.localeCompare(b.Created);
      },
      // defaultSortOrder: "ascend",
      sortDirections: ["ascend", "descend", "ascend"],
    },
  ];
  return (
    <div className="bg-white p-2">
      <PendingDrawer />
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
        rowKey={"transactionNumber"}
        columns={columns}
        loading={fetchPendingTicketLoading}
        dataSource={pendingTickets}
        scroll={{ y: "60vh", x: "100vw" }}
      />
    </div>
  );
};

export default PendingTickets;
