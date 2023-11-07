import { Table } from "ant-table-extensions";
import React, { useState } from "react";
import { searchFunction } from "../../../../../helpers/searchFunction";
import moment from "moment";
import MenuButton from "../../../../UI/Menu/MenuButton";
import Button from "../../../../UI/Button/Button";
import { deleteArchive } from "../../../../../store/api/resources-api";
import { message } from "antd";

const WeatherArchiveTable = ({ data, fetchLoading, setData }) => {
  const [deleteLoading, setDeleteLoading] = useState([]);
  const deleteHandler = async (path) => {
    setDeleteLoading((prev) => [...prev, path]);
    const request = await deleteArchive({ body: { path } });
    if (request.name === "AxiosError") {
      message.error(request.response.data.message);
    } else {
      message.success(request.data.message);
      setData((prev) => prev.filter((a) => a.path != path));
    }

    setDeleteLoading((prev) => prev.filter((a) => a !== path));
  };
  const columns = [
    {
      title: "Action",
      dataIndex: null,
      render: (d) => (
        <MenuButton type="primary" text="Action">
          <Button
            type="menu"
            text="Download"
            onClick={() =>
              window.open(
                [import.meta.env.VITE_BASE_URL, "/", d.path.slice(2)].join(""),
                "_blank"
              )
            }
          />
          <Button
            type="menu"
            text="Delete"
            onClick={() => deleteHandler(d.path)}
            loading={deleteLoading.includes(d.path)}
          />
        </MenuButton>
      ),
    },
    {
      title: "Date Time Archived",
      dataIndex: "dateCreated",
      render: (data) => moment(data).format("lll"),

      sorter: (a, b) => new Date(a.dateCreated) - new Date(b.dateCreated),
      sortDirections: ["ascend", "descend", "ascend"],
    },
    {
      title: "File Size",
      dataIndex: "size",
      render: (d) => `${(d / 1000000).toFixed(2)} MB`,
    },
  ];
  return (
    <div className="w-full h-full">
      <Table
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 10,
          pageSizeOptions: [10, 20, 50, 100],
        }}
        rowKey={"path"}
        columns={columns}
        loading={fetchLoading}
        dataSource={data}
        scroll={{ y: "55vh", x: "100vw" }}
      />
    </div>
  );
};

export default WeatherArchiveTable;
