import { Table } from "ant-table-extensions";
import { Tag, message } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchFunction } from "../../../../../helpers/searchFunction";
import { addReportOfTheDay } from "../../../../../store/api/ticket-api";
import { ticketsActions } from "../../../../../store/store";
import Badge from "../../../../UI/Badge/Badge";
import Button from "../../../../UI/Button/Button";
import MenuButton from "../../../../UI/Menu/MenuButton";
import HazardNoteDrawer from "./Drawers/HazardNoteDrawer";
import OngoingDrawer from "./Drawers/OngoingDrawer";

const {
  updateReportsOfTheDay,
  updateSupervisorTickets,
  selectOngoingTicket,
  fetchSupervisorTickets,
} = ticketsActions;

const SupervisorTickets = () => {
  const { socket, currentUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const resources = useSelector((state) => state.resources);
  const { agentList } = resources;
  const [selectedTicket, setSelectedTicket] = useState(null);
  const dispatch = useDispatch();
  const { supervisorTickets, fetchSupervisorTicketsLoading } = useSelector(
    (state) => state.tickets
  );

  const setAsReportOfTheDay = async (transactionNumber, hazardNote) => {
    setLoading(true);
    const request = await addReportOfTheDay({
      body: {
        transactionNumber,
        hazardNote,
      },
    });

    if (!request || request.name === "AxiosError") {
      message.warning(request?.response?.data?.message || "Request error");
      if (request?.response?.data?.error == 409) {
        setSelectedTicket(null);
      }
    } else {
      message.success(request?.data?.message || "Request error");
      if (request?.data?.data) {
        dispatch(updateReportsOfTheDay(request?.data?.data));
        // dispatch(updateSupervisorTickets(request?.data?.data));
        setSelectedTicket(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (socket) {
      socket.on("ongoingTickets", async ({ data }) => {
        if (data.commandCenterId === currentUser.commandCenterId) {
          dispatch(fetchSupervisorTickets());
        }
      });
    }
    return () => {
      if (socket) socket.off("ongoingTickets");
    };
  }, [socket]);

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

              {data.isReported === 0 && (
                <Button
                  onClick={() => setSelectedTicket(data)}
                  type="menu"
                  text="Set as report of the day"
                />
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
      dataIndex: "typeName",
      render: (data) => (
        <div className="flex flex-col items-center">
          <Badge type="caseType" text={data} />
        </div>
      ),

      //   filters: getFilters(supervisorTickets, "caseType", getTypeName),
      onFilter: (value, record) => record.typeName === value,
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
      render: (data) => moment(data).format("lll"),

      sorter: (a, b) => {
        return a.dateCreated?.localeCompare(b.Created);
      },
      defaultSortOrder: "ascend",
      sortDirections: ["ascend", "descend", "ascend"],
    },
    {
      width: "200px",
      title: "Address",
      dataIndex: "address",
    },
  ];
  return (
    <div className="bg-white p-2">
      <OngoingDrawer />
      <HazardNoteDrawer
        setAsReportOfTheDay={setAsReportOfTheDay}
        selectedTicket={selectedTicket}
        setSelectedTicket={setSelectedTicket}
        loading={loading}
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
        loading={fetchSupervisorTicketsLoading}
        dataSource={supervisorTickets}
        scroll={{ y: "60vh", x: "100vw" }}
      />
    </div>
  );
};

export default SupervisorTickets;
