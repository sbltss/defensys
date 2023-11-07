import { Table } from "antd";
import React from "react";
import Button from "../../../../../UI/Button/Button";
import Badge from "../../../../../UI/Badge/Badge";
import MenuButton from "../../../../../UI/Menu/MenuButton";
import moment from "moment";
import { searchFunction } from "../../../../../../helpers/searchFunction";

const List = ({ data, isLoading, selectBarangay }) => {
  const columns = [
    {
      width: "70px",
      title: "Action",
      dataIndex: null,
      render: (d) => (
        <MenuButton type="primary" text="Action">
          <Button type="menu" text="Edit" onClick={() => selectBarangay(d)} />
        </MenuButton>
      ),
    },
    {
      width: "70px",
      title: "Barangay Code",
      dataIndex: "brgyCode",
    },
    {
      width: "100px",
      title: "Name",
      dataIndex: "name",
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
      rowKey={"brgyCode"}
      columns={columns}
      loading={isLoading}
      dataSource={data}
      scroll={{ y: "60vh", x: "100vw" }}
    />
  );
};

export default List;
