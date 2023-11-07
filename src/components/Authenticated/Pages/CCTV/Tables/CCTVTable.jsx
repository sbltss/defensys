import { Table } from "ant-table-extensions";
import { Typography } from "antd";
import moment from "moment";
import React from "react";
import { searchFunction } from "../../../../../helpers/searchFunction";
import CameraTable from "./CameraTable";

const CCTVTable = ({ fetchCctvLoading, cctvList }) => {
  const columns = [
    // {
    //   title: "Action",
    //   dataIndex: null,
    //   render: (d) => (
    //     <MenuButton type="primary" text="Action">
    //       <ActionButton
    //         type="menu"
    //         text="Edit"
    //         // onClick={() => openDrawerHandler(d)}
    //       />
    //       <ActionButton
    //         type="menu"
    //         text="Add Camera"
    //         // onClick={() => deactivateAccountHandler(d.accountId)}
    //       />
    //     </MenuButton>
    //   ),
    // },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "IP:Port",
      dataIndex: null,
      render: (d) => `${d.ip}:${d.port}`,
    },
    {
      title: "Description",
      dataIndex: "description",

      render: (data) => (
        <Typography.Paragraph
          ellipsis={{
            rows: 3,
            expandable: true,
            onExpand: () => {},
          }}
        >
          {data}
        </Typography.Paragraph>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      render: (data) => moment(data).format("lll"),
    },
    {
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
      loading={fetchCctvLoading}
      dataSource={cctvList}
      scroll={{ y: "60vh", x: "100vw" }}
      expandable={{ expandedRowRender: CameraTable }}
    />
  );
};

export default CCTVTable;
