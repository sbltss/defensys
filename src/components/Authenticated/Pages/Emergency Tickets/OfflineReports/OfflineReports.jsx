import { Table } from "ant-table-extensions";
import { Image } from "antd";
import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchFunction } from "../../../../../helpers/searchFunction";
import { ticketsActions } from "../../../../../store/store";
import Button from "../../../../UI/Button/Button";
import MenuButton from "../../../../UI/Menu/MenuButton";
import ReportDrawer from "./Drawer/ReportDrawer";

const { selectOfflineReport } = ticketsActions;

const OfflineReports = () => {
  const dispatch = useDispatch();
  const { offlineReports, fetchOfflineReportsLoading, selectedOfflineReport } =
    useSelector((state) => state.tickets);
  const columns = [
    {
      width: "100px",
      title: "",
      dataIndex: null,
      render: (data) => {
        return (
          <MenuButton type="primary" anchor="bottomLeft" text={"Action"}>
            <Button
              onClick={() => dispatch(selectOfflineReport(data))}
              type="menu"
              text="View Ticket"
            />
          </MenuButton>
          // <Button
          //   // onClick={() => viewTicket(data)}
          //   type={!!data.isRead ? "warning" : "primary"}
          //   text={!!data.isRead ? "Viewed" : "View Ticket"}
          //   disabled={!!data.isRead && +data.isRead !== +currentUser.accountId}
          // />
        );
      },
    },
    {
      width: "100px",
      title: "Response Team",
      dataIndex: null,
      render: (data) => (
        <span>{`${data.firstName} ${data.lastName} (${data.type})`}</span>
      ),
    },
    {
      width: "100px",
      title: "Contact Number",
      dataIndex: "contactNumber",
    },
    {
      width: "100px",
      title: "Image",
      dataIndex: "imgUrl",
      render: (data) => (
        <>
          {data.split(";;;").map((img) => {
            return (
              <Image
                key={img}
                src={import.meta.env.VITE_BASE_URL + "/" + img}
                alt="Image"
                width={150}
                height={150}
                className="object-cover"
              />
            );
          })}
        </>
      ),
    },
    {
      width: "100px",
      title: "Remarks",
      dataIndex: "remarks",
    },
    {
      width: "100px",
      title: "Date Created",
      dataIndex: "dateCreated",
      render: (data) => moment(data).format("lll"),
      sorter: (a, b) => {
        return a.dateCreated.localeCompare(b.Created);
      },
      defaultSortOrder: "descend",
      sortDirections: ["ascend", "descend", "ascend"],
    },
  ];
  return (
    <div className="bg-white p-2">
      <ReportDrawer
        selectedOfflineReport={selectedOfflineReport}
        onClose={() => dispatch(selectOfflineReport(null))}
      />
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
        loading={fetchOfflineReportsLoading}
        dataSource={offlineReports}
        scroll={{ y: "60vh", x: "100vw" }}
      />
    </div>
  );
};

export default OfflineReports;
