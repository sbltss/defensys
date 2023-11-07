import { Table } from "ant-table-extensions";
import moment from "moment";
import React from "react";
import Button from "../../../../../UI/Button/Button";
import MenuButton from "../../../../../UI/Menu/MenuButton";

const Plans = ({ plans, setSelectedPlan }) => {
  const columns = [
    {
      title: "Action",
      dataIndex: null,
      render: (e) => (
        <MenuButton text={"Action"} type={"primary"}>
          <Button type="menu" text="Edit" onClick={() => setSelectedPlan(e)} />
        </MenuButton>
      ),
    },
    {
      title: "Duration",
      dataIndex: "numOfMonths",
      render: (e) => `${e} month${e > 1 ? "s" : ""}`,
    },
    {
      title: "Rate",
      dataIndex: "rate",
      render: (e) => `${e} PHP`,
    },
    {
      title: "Description",
      dataIndex: "description",
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
  return <Table rowKey={"planId"} columns={columns} dataSource={plans} />;
};

export default Plans;
