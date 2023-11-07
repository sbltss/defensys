import { Table } from "ant-table-extensions";
import React from "react";
import { searchFunction } from "../../../../../helpers/searchFunction";
import moment from "moment";

const FloodTable = ({ data, fetchLoading }) => {
  const columns = [
    {
      title: "Date Time",
      dataIndex: "dateCreated",
      render: (data) => moment(data).format("lll"),
    },
    {
      title: "Avg Flood Height",
      dataIndex: "avgFloodHeight",
    },
    {
      title: "River Depth",
      dataIndex: "riverDepth",
    },
    {
      title: "Water Level",
      dataIndex: "waterLvl",
    },
  ];
  return (
    <div className="w-full h-full">
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
        rowKey={"floodId"}
        columns={columns}
        loading={fetchLoading}
        dataSource={data}
        scroll={{ y: "60vh", x: "100vw" }}
      />
    </div>
  );
};

export default FloodTable;
