import { Table } from "ant-table-extensions";
import moment from "moment";
import React from "react";
import Button from "../../../../../UI/Button/Button";
import MenuButton from "../../../../../UI/Menu/MenuButton";
import { Tag } from "antd";
import { useSelector } from "react-redux";

const Subscriptions = ({ subscriptions, setSelectedSubscription, loading }) => {
  const { departmentList } = useSelector((state) => state.resources);
  const columns = [
    {
      title: "Action",
      dataIndex: null,
      render: (e) => (
        <MenuButton text={"Action"} type={"primary"}>
          <Button
            type="menu"
            text="View"
            onClick={() => setSelectedSubscription(e)}
          />
        </MenuButton>
      ),
    },
    {
      title: "Department",
      dataIndex: "departmentId",
      render: (d) => {
        const dept = departmentList.find((e) => e.accountId === d);
        return dept?.name;
      },
    },
    {
      title: "Payment Status",
      dataIndex: null,
      render: (data) => {
        if (data?.status === "rejected")
          return (
            <div className="flex justify-center items-center">
              <Tag color="red">Rejected</Tag>
            </div>
          );
        if (data?.status === "verification")
          return (
            <div className="flex justify-center items-center">
              <Tag color="orange">For Verification</Tag>
            </div>
          );
        if (data?.status === "approved")
          return (
            <div className="flex justify-center items-center">
              <Tag color="green">Approved</Tag>
            </div>
          );
      },
      defaultSortOrder: "descend",
      sortDirections: ["descend", "ascend", "descend"],
      sorter: (a, b) => {
        let aVal = "";
        let bVal = "";
        if (a.status === "verification") aVal = "For Verification";
        else if (a?.status === "rejected") aVal = "rejected";
        else if (a.status === "approved") aVal = "Paid";

        if (!b) bVal === "pending";
        else if (b.status === "verification") bVal = "For Verification";
        else if (b?.status === "rejected") bVal = "rejected";
        else if (b.status === "approved") bVal = "Paid";

        return aVal.localeCompare(bVal);
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
    },
    {
      title: "Date Updated",
      dataIndex: "dateUpdated",
      render: (e) => moment(e).format("lll"),
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      render: (e) => moment(e).format("lll"),
    },
  ];

  return (
    <Table
      loading={loading}
      rowKey={"batchId"}
      columns={columns}
      dataSource={subscriptions}
    />
  );
};

export default Subscriptions;
