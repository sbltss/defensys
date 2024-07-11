import { Table } from "ant-table-extensions";
import React from "react";
import Button from "../../../../../UI/Button/Button";
import Badge from "../../../../../UI/Badge/Badge";
import MenuButton from "../../../../../UI/Menu/MenuButton";
import moment from "moment";
import { searchFunction } from "../../../../../../helpers/searchFunction";

const List = ({ data, isLoading, selectBarangay }) => {
  console.log(data);
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
      title: "Date Created",
      dataIndex: "dateCreated",
      // defaultSortOrder: "ascend",
      sorter: (a, b) => a.dateCreated.localeCompare(b.dateCreated),
      defaultSortOrder: "descend",
      render: (e) => moment(e).format("lll"),
    },
  ];
  return (
    <Table
      searchableProps={{
        searchFunction: searchFunction,
      }}
      searchable={true}
      exportable={true}
      exportableProps={{ showColumnPicker: true }}
      pagination={{
        showSizeChanger: true,
        defaultPageSize: 10,
        pageSizeOptions: [10, 20, 50, 100],
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
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
