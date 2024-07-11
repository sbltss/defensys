import React from "react";
import moment from "moment";
import { Table } from "ant-table-extensions";
import { useSelector } from "react-redux";
import Button from "../../../../UI/Button/Button";
import { getFilters, getReportCategory } from "../../../../../helpers";
import Badge from "../../../../UI/Badge/Badge";
import { searchFunction } from "../../../../../helpers/searchFunction";
import { Tag } from "antd";

const Reports = ({ selectTicketHandler }) => {
  const { fetchedTickets, isLoading } = useSelector((state) => state.reports);
  console.log(fetchedTickets.filter((ticket) => ticket.status === 2));
  const { caseTypes, reportCategory } = useSelector((state) => state.resources);
  console.log(reportCategory);
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
      render: (d) => (
        <div className="flex flex-col">
          <span>{`${d.firstName} ${d.lastName}`}</span>
          {d?.departmentName || d?.departmentType ? (
            <div>
              <Tag color="red" className="mx-0">
                {d?.departmentType} - {d?.departmentName}
              </Tag>
            </div>
          ) : null}
        </div>
      ),
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
      title: "Report Categorys=",
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
        showTotal: (total, range) => `Showing ${range[1]} of ${total} records`,
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
