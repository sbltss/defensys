import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Badge from "../../../../UI/Badge/Badge";
import moment from "moment";
import mtz from "moment-timezone";
import { Tag, message } from "antd";
import { Table } from "ant-table-extensions";
import Button from "../../../../UI/Button/Button";
import {
  updateHazardNote,
  updateTicketReportOfTheDay,
} from "../../../../../store/api/ticket-api";
import { ticketsActions } from "../../../../../store/store";
import { searchFunction } from "../../../../../helpers/searchFunction";
import OngoingDrawer from "../SupervisorTickets/Drawers/OngoingDrawer";
import { useState } from "react";
import MenuButton from "../../../../UI/Menu/MenuButton";
import HazardNoteDrawer from "./Drawers/HazardNoteDrawer";
import { getFilters } from "../../../../../helpers";

const { updateReportsOfTheDay, updateSupervisorTickets, selectOngoingTicket } =
  ticketsActions;

const ReportsOfTheDay = () => {
  const dispatch = useDispatch();
  const resources = useSelector((state) => state.resources);
  const { currentUser } = useSelector((state) => state.auth);
  const { agentList } = resources;
  const [updateLoading, setUpdateLoading] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const { reportsOfTheDay, fetchReportsOfTheDayLoading } = useSelector(
    (state) => state.tickets
  );

  const { caseTypes } = resources;

  const getTypeName = (id) => {
    return caseTypes?.filter((ct) => +ct.id === +id)[0]?.typeName;
  };

  const setAsReportOfTheDay = async (hazardId) => {
    const request = await updateTicketReportOfTheDay({
      param: hazardId,
      body: {
        isDone: 1,
      },
    });

    if (!request || request.name === "AxiosError") {
      message.warning(request?.response?.data?.message || "Request error");
    } else {
      message.success(request?.data?.message || "Request error");
      if (request?.data?.data) {
        dispatch(updateReportsOfTheDay(request?.data?.data));
        dispatch(updateSupervisorTickets(request?.data?.data));
      }
    }
  };

  const updateHazardNoteHandler = async (e) => {
    setUpdateLoading(true);
    const request = await updateTicketReportOfTheDay({
      body: e,
      param: selectedTicket.hazardId,
    });
    if (request.name === "AxiosName")
      message.error(request.response.data.message);
    else {
      message.success(request.data.message);
      dispatch(updateReportsOfTheDay(request?.data?.data));
    }
    setSelectedTicket(null);
    setUpdateLoading(false);
  };

  const columns = [
    {
      width: 150,
      title: "",
      dataIndex: null,
      render: (data) => {
        const agentName = agentList.filter(
          (agent) => +agent.accountId === +data.isRead
        )[0];
        return (
          <div className="flex flex-col gap-1 justify-center items-center">
            <MenuButton type="primary" anchor="right" text={"Action"}>
              <Button
                onClick={() => dispatch(selectOngoingTicket(data))}
                type="menu"
                text="View ticket"
              />
              {["supervisor", "contentwriter"].includes(
                currentUser.accountType
              ) && (
                <>
                  <Button
                    onClick={() => setAsReportOfTheDay(data.hazardId)}
                    type="menu"
                    text="Set as done"
                  />
                  <Button
                    onClick={() => setSelectedTicket(data)}
                    type="menu"
                    text="Edit hazard note"
                  />
                </>
              )}
            </MenuButton>
            {agentList.length > 0 && !!data.isRead && (
              <span className="text-xs font-medium text-gray-600">{`${agentName?.firstName[0]}. ${agentName?.lastName}`}</span>
            )}
          </div>
        );
      },
    },
    {
      width: "150px",
      title: "Type",
      dataIndex: "caseType",
      render: (data) => <Badge type="caseType" text={getTypeName(data)} />,
      filters: getFilters(reportsOfTheDay, "caseType", getTypeName),
      onFilter: (value, record) => record.caseType === value,
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
      defaultSortOrder: "ascend",
      sortDirections: ["ascend", "descend", "ascend"],
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
      render: (data) =>
        data ? <nobr>{data}</nobr> : "Not tagged to an emergency ticket",
    },
    // {
    //   width: "150px",
    //   title: "Citizen",
    //   dataIndex: null,

    //   render: (data) => (
    //     <div className="flex flex-col items-center">
    //       <span>{`${data.firstName} ${data.lastName}`}</span>
    //       {!data.callerId && (
    //         <div>
    //           <Tag color="red" className="mx-0">
    //             Non-registered
    //           </Tag>
    //         </div>
    //       )}
    //     </div>
    //   ),
    // },
    {
      width: "200px",
      title: "Hazard Note",
      dataIndex: "hazardNote",
    },
    {
      width: "130px",
      title: "callerId",
      dataIndex: "callerId",
    },
    {
      width: "130px",
      title: "Mobile",
      dataIndex: "mobileNumber",
    },
  ];
  return (
    <div className="bg-white p-2">
      <HazardNoteDrawer
        updateHazardNoteHandler={updateHazardNoteHandler}
        selectedTicket={selectedTicket}
        setSelectedTicket={setSelectedTicket}
        updateLoading={updateLoading}
      />
      <OngoingDrawer />
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
        rowKey={"hazardId"}
        columns={columns}
        loading={fetchReportsOfTheDayLoading}
        dataSource={[...reportsOfTheDay].filter(
          (ticket) => ticket.isDone === 0
        )}
        scroll={{ y: "60vh", x: "100vw" }}
      />
    </div>
  );
};

export default ReportsOfTheDay;
