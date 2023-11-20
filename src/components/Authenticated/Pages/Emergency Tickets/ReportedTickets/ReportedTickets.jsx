import { Table } from "ant-table-extensions";
import { Tag } from "antd";
import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilters } from "../../../../../helpers";
import { searchFunction } from "../../../../../helpers/searchFunction";
import Badge from "../../../../UI/Badge/Badge";
import ReportedDrawer from "./Drawer/ReportedDrawer";
import { ticketsActions } from "../../../../../store/store";
import Button from "../../../../UI/Button/Button";

const { selectReportedTicket } = ticketsActions;

const ReportedTickets = () => {
  const dispatch = useDispatch();
  const {
    reportedTickets,
    fetchReportedTicketLoading,
    selectedReportedTicket,
  } = useSelector((state) => state.tickets);
  const resources = useSelector((state) => state.resources);
  const { caseTypes } = resources;

  const getTypeName = (id) => {
    return caseTypes?.filter((ct) => +ct.id === +id)[0]?.typeName;
  };
  const columns = [
    {
      title: "",
      dataIndex: null,
      render: (data) => {
        return (
          <Button
            onClick={() => dispatch(selectReportedTicket(data))}
            type={"primary"}
            text={"View Ticket"}
          />
        );
      },
      width: "150px",
    },
    {
      title: "Type",
      dataIndex: "caseType",
      render: (data) => <Badge type="caseType" text={getTypeName(data)} />,
      width: "200px",
      filters: getFilters(reportedTickets, "caseType", getTypeName),
      onFilter: (value, record) => record.caseType === value,
    },
    {
      title: "Injury",
      dataIndex: "withInjury",
      render: (data) => (
        <Badge type={+data === 0 ? "withoutInjury" : "withInjury"} />
      ),
      width: "150px",
    },
    {
      title: "Ticket Number",
      dataIndex: "transactionNumber",
      render: (data) => <nobr>{data}</nobr>,
      width: "200px",
    },
    {
      title: "Citizen",
      dataIndex: null,
      width: "200px",
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
      title: "Mobile",
      dataIndex: "mobileNumber",
      width: "150px",
    },
    {
      title: "Date",
      dataIndex: "dateCreated",
      render: (data) => moment(data).format("lll"),
      width: "150px",
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
    <>
      <ReportedDrawer
        selectedReportedTicket={selectedReportedTicket}
        onClose={() => dispatch(selectReportedTicket(null))}
      />
      <div className="bg-white p-2">
        <Table
          align="center"
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
          loading={fetchReportedTicketLoading}
          dataSource={reportedTickets}
          scroll={{ y: "60vh", x: "100vw" }}
        />
      </div>
    </>
  );
};

export default ReportedTickets;
