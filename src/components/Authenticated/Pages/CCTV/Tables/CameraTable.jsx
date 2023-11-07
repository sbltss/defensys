import { Table } from "ant-table-extensions";
import React from "react";
import { searchFunction } from "../../../../../helpers/searchFunction";

const CameraTable = ({ cameras }) => {
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
    //       {d.isDeleted === 0 && (
    //         <ActionButton
    //           type="menu"
    //           text="Deactivate"
    //           // onClick={() => deactivateAccountHandler(d.accountId)}
    //         />
    //       )}
    //     </MenuButton>
    //   ),
    // },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "RTSP URL",
      dataIndex: "rtspUrl",
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
      dataSource={cameras}
      scroll={{ y: "60vh", x: "100vw" }}
    />
  );
};

export default CameraTable;
