import { Table } from "antd";
import moment from "moment";
import React from "react";
import { searchFunction } from "../../../../helpers/searchFunction";
import Button from "../../../UI/Button/Button";
import MenuButton from "../../../UI/Menu/MenuButton";

const List = ({ data, isLoading, selectVersion }) => {
  const columns = [
    {
      width: "70px",
      title: "Action",
      dataIndex: null,
      render: (d) => (
        <MenuButton type="primary" text="Action">
          <Button type="menu" text="Edit" onClick={() => selectVersion(d)} />
        </MenuButton>
      ),
    },
    {
      width: "100px",
      title: "Type",
      dataIndex: "type",
    },
    {
      width: "100px",
      title: "Platform",
      dataIndex: "platform",
    },
    {
      width: "100px",
      title: "Current Version",
      dataIndex: "currentVersion",
    },
    {
      width: "100px",
      title: "Supported Version",
      dataIndex: "supportedVersion",
    },
    {
      width: "100px",
      title: "Date Created",
      dataIndex: "dateCreated",
      render: (data) => moment(data).format("lll"),
    },
    {
      width: "100px",
      title: "Date Updated",
      dataIndex: "dateUpdated",
      render: (data) => moment(data).format("lll"),
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
      loading={isLoading}
      dataSource={data}
      scroll={{ y: "60vh", x: "100vw" }}
    />
  );
};

export default List;
