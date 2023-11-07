import React from "react";
import moment from "moment";
import { Table } from "ant-table-extensions";
import { useSelector } from "react-redux";
import Button from "../../../../UI/Button/Button";
import { getFilters, getReportCategory } from "../../../../../helpers";
import Badge from "../../../../UI/Badge/Badge";
import { searchFunction } from "../../../../../helpers/searchFunction";

const Reports = ({ selectTicketHandler }) => {
  const { fetchedTickets, isLoading } = useSelector((state) => state.reports);
  const { caseTypes, reportCategory } = useSelector((state) => state.resources);
  const getTypeName = (id) => {
    return caseTypes?.filter((ct) => +ct.id === +id)[0]?.typeName;
  };
  const columns = [
    {
      width: 100,
      title: "Action",
      dataIndex: null,
      render: (d) => (
        <Button
          type="primary"
          text="View"
          onClick={() => selectTicketHandler(d)}
        />
      ),
    },
    {
      width: 200,
      title: "Type",
      dataIndex: "caseTypeDesc",
      render: (data) => <Badge type="caseType" text={data} />,
      filters: getFilters(fetchedTickets, "caseType", getTypeName),
      onFilter: (value, record) => record.caseTypeDesc === value,
    },
    {
      width: 200,
      title: "Transaction Number",
      dataIndex: "transactionNumber",
      render: (data) => <nobr>{data}</nobr>,
    },
    {
      width: 150,
      title: "Status",
      dataIndex: "status",
      render: (d) => <Badge type="ticketStatus" text={d} />,
    },
    {
      width: 200,
      title: "Citizen",
      dataIndex: null,
      render: (d) => `${d.firstName} ${d.lastName}`,
    },
    {
      width: 150,
      title: "Mobile",
      dataIndex: "mobileNumber",
    },
    {
      width: 200,
      title: "Date",
      dataIndex: "dateCreated",
      render: (data) => moment(data).format("lll"),
      sorter: (a, b) => {
        return a.dateCreated.localeCompare(b.Created);
      },
      defaultSortOrder: "ascend",
      sortDirections: ["ascend", "descend", "ascend"],
    },
    {
      width: 200,
      title: "Report Category",
      dataIndex: null,
      render: (d) =>
        getReportCategory(
          d.reportCategory,
          d.reportCategoryDesc,
          reportCategory
        ),
    },
    {
      width: 200,
      title: "Created By",
      dataIndex: "createdBy",
    },
  ];
  return (
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
      loading={isLoading}
      dataSource={fetchedTickets.filter((ticket) => ticket.status === 2)}
      scroll={{ y: "60vh", x: "100vw" }}
    />
  );
};

export default Reports;
