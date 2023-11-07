import { Table } from "ant-table-extensions";
import moment from "moment";
import React from "react";
import Button from "../../../../../UI/Button/Button";
import MenuButton from "../../../../../UI/Menu/MenuButton";
import { Tag } from "antd";
import { useSelector } from "react-redux";

const Subscriptions = ({ subscriptions, setSelectedPlan }) => {
  const { responseTeamsList } = useSelector((state) => state.resources);
  const columns = [
    // {
    //   title: "Action",
    //   dataIndex: null,
    //   render: (e) => (
    //     <MenuButton text={"Action"} type={"primary"}>
    //       <Button type="menu" text="Edit" onClick={() => setSelectedPlan(e)} />
    //     </MenuButton>
    //   ),
    // },
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
        else if (b.status === "approved") bVal = "Approved";

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
  const nestedColumns = [
    {
      title: "Name",
      dataIndex: null,
      render: (d) => `${d.firstName} ${d.lastName}`,
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Mobile Number",
      dataIndex: "contactNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
  ];
  return (
    <Table
      expandable={{
        expandedRowRender: (record) => (
          <Table
            rowKey={"accountId"}
            columns={nestedColumns}
            dataSource={responseTeamsList.filter((e) =>
              record.responders.includes(e.accountId)
            )}
            pagination={false}
          />
        ),
      }}
      rowKey={"batchId"}
      columns={columns}
      dataSource={subscriptions}
    />
  );
};

export default Subscriptions;
