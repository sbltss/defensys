import { Table } from "ant-table-extensions";
import React from "react";
import Button from "../../../../../../UI/Button/Button";
import moment from "moment";
import { searchFunction } from "../../../../../../../helpers/searchFunction";

const Types = ({ fetchLoading, types, setSelectedType }) => {
  const columns = [
    {
      title: "Action",
      render: (d) => (
        <Button type="primary" text="Edit" onClick={() => setSelectedType(d)} />
      ),
    },
    {
      title: "Type Name",
      dataIndex: "typeName",
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      render: (d) => moment(d).format("LLL"),
    },
    {
      title: "Date Updated",
      dataIndex: "dateUpdated",
      render: (d) => moment(d).format("LLL"),
    },
  ];
  return (
    <Table
      searchableProps={{ searchFunction }}
      scroll={{ y: "64vh" }}
      columns={columns}
      dataSource={types}
      loading={fetchLoading}
      rowKey={"id"}
    />
  );
};

export default Types;
