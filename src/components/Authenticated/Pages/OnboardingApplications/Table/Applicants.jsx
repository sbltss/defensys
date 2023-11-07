import React from "react";
import moment from "moment";
import { Table } from "ant-table-extensions";
import Button from "../../../../UI/Button/Button";
import { searchFunction } from "../../../../../helpers/searchFunction";
import { Tag } from "antd";

const Applicants = ({ selectApplicant, applicants, loading }) => {
  const columns = [
    {
      width: 100,
      title: "Action",
      dataIndex: null,
      render: (d) => (
        <Button type="primary" text="View" onClick={() => selectApplicant(d)} />
      ),
    },
    {
      width: 200,
      title: "Organization Name",
      dataIndex: "name",
    },
    {
      width: 200,
      title: "Address",
      dataIndex: "address",
    },
    {
      width: 150,
      title: "Representative",
      dataIndex: null,
      render: (d) => [d.firstName, d.lastName, `${-d.contactNumber}`].join(" "),
    },
    {
      width: 150,
      title: "Status",
      dataIndex: null,
      render: (data) => (
        <div className="flex flex-col justify-center items-center">
          <Tag
            color={
              data.status === 0 ? "yellow" : data.status === 1 ? "green" : "red"
            }
          >
            {data.status === 0
              ? "Pending"
              : data.status === 1
              ? "Approved"
              : "Rejected"}
          </Tag>
          <span className="text-xs text-center">
            {data.status === -1 ? `Reason: ${data.remarks}` : ""}
          </span>
        </div>
      ),
      filters: [
        { text: "Pending", value: 0 },
        { text: "Approved", value: 1 },
        { text: "Rejected", value: -1 },
      ],
      onFilter: (value, record) => record.status === value,
    },

    {
      width: 200,
      title: "Date of Application",
      dataIndex: "dateCreated",
      render: (data) => moment(data).format("lll"),
      sorter: (a, b) => {
        return a.dateCreated.localeCompare(b.Created);
      },
      defaultSortOrder: "ascend",
      sortDirections: ["ascend", "descend", "ascend"],
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
      rowKey={"id"}
      columns={columns}
      loading={loading}
      dataSource={applicants}
      scroll={{ y: "60vh", x: "100vw" }}
    />
  );
};

export default Applicants;
