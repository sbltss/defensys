import { Table } from "ant-table-extensions";
import { Tag } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilters } from "../../../../../helpers";
import { searchFunction } from "../../../../../helpers/searchFunction";
import { chatActions, ticketsActions } from "../../../../../store/store";
import Badge from "../../../../UI/Badge/Badge";
import Button from "../../../../UI/Button/Button";
import MenuButton from "../../../../UI/Menu/MenuButton";
import AcceptedDrawer from "./Drawers/AcceptedDrawer";
import TagCitizenDrawer from "./Drawers/TagCitizenDrawer/TagCitizenDrawer";
import TransferTicketDrawer from "./Drawers/TransferTicketDrawer/TransferTicketDrawer";

const { selectAcceptedTicket } = ticketsActions;
const { selectChatTicket } = chatActions;

const AcceptedTickets = () => {
  const [tagTicket, setTagTicket] = useState(null);
  const [transferTicket, setTransferTicket] = useState(null);
  const dispatch = useDispatch();
  const { acceptedTickets, fetchAcceptedTicketLoading } = useSelector(
    (state) => state.tickets
  );
  const resources = useSelector((state) => state.resources);
  const { currentUser } = useSelector((state) => state.auth);
  const { caseTypes } = resources;

  const getTypeName = (id) => {
    return caseTypes?.filter((ct) => +ct.id === +id)[0]?.typeName;
  };

  const selectTicket = (e) => {
    dispatch(selectAcceptedTicket(e));
  };

  const selectChatTicketHandler = (e) => {
    dispatch(selectChatTicket(e));
  };

  const columns = [
    {
      width: "150px",
      title: "",
      dataIndex: null,
      render: (data) => {
        return (
          <MenuButton type="primary" anchor="bottomLeft" text={"Action"}>
            <Button
              onClick={() => selectChatTicketHandler(data)}
              type="menu"
              text="Message"
            />
            <Button
              onClick={() => selectTicket(data)}
              type="menu"
              text="View Ticket"
            />
            {/* <Button
              // onClick={() => reportTicketHandler("Redundant Report")}
              type="menu"
              text="Resolve Ticket"
            /> */}
            {currentUser.accountType === "agent" && (
              <Button
                onClick={() => setTransferTicket(data)}
                type="menu"
                text="Transfer Ticket"
              />
            )}

            {!data.callerId && (
              <Button
                onClick={() => setTagTicket(data)}
                type="menu"
                text="Tag Citizen"
              />
            )}
          </MenuButton>
          // <Button
          //   // onClick={() => viewTicket(data)}
          //   type={!!data.isRead ? "warning" : "primary"}
          //   text={!!data.isRead ? "Viewed" : "View Ticket"}
          //   disabled={!!data.isRead && +data.isRead !== +currentUser.accountId}
          // />
        );
      },
    },
    {
      width: "200px",
      title: "Type",
      dataIndex:
        currentUser.accountType === "agent" ? "caseTypeDesc" : "typeName",
      render: (data) => <Badge type="caseType" text={data} />,
      filters: getFilters(acceptedTickets, "caseType", getTypeName),
      onFilter: (value, record) =>
        currentUser.accountType === "agent"
          ? record.caseTypeDesc === value
          : record.typeName === value,
    },
    {
      width: "150px",
      title: "Injury",
      dataIndex: "withInjury",
      render: (data) => (
        <Badge type={data === 0 ? "withoutInjury" : "withInjury"} />
      ),
    },
    {
      width: "200px",
      title: "Ticket Number",
      dataIndex: "transactionNumber",
      render: (data) => <nobr>{data}</nobr>,
    },
    {
      width: "150px",
      title: "Status",
      dataIndex: null,
      render: (d) => {
        console.log(d)
        if (currentUser.accountType === "department" && d.status === 2)
          return <Badge type={"ticketStatus"} text={d.status} />;
        return (
          <Badge
            type={
              currentUser.accountType === "agent"
                ? "ticketStatus"
                : "allocateStatus"
            }
            text={
              currentUser.accountType === "agent" ? d.status : d.ticketStatus
            }
          />
        );
      },
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
      width: "150px",
      title: "Mobile",
      dataIndex: "mobileNumber",
    },
    {
      width: "150px",
      title: "Date",
      dataIndex: "dateCreated",
      render: (data) => moment(data).format("lll"),
      sorter: (a, b) => {
        return a.dateCreated.localeCompare(b.Created);
      },
      defaultSortOrder: "descend",
      sortDirections: ["ascend", "descend", "ascend"],
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      width: "150px",
    },
    {
      title: "Address",
      dataIndex: "address",
      width: "150px",
    },
  ];
  return (
    <div className="bg-white p-2">
      <TransferTicketDrawer
        ticket={transferTicket}
        open={!!transferTicket}
        closeDrawer={() => setTransferTicket(null)}
      />
      <AcceptedDrawer />
      <TagCitizenDrawer
        tagTicket={tagTicket}
        closeDrawer={() => setTagTicket(null)}
      />
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
        loading={fetchAcceptedTicketLoading}
        dataSource={acceptedTickets}
        scroll={{ y: "60vh", x: "100vw" }}
      />
    </div>
  );
};

export default AcceptedTickets;
