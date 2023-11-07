import { Table } from "ant-table-extensions";
import moment from "moment";
import React from "react";
import { searchFunction } from "../../../../../../helpers/searchFunction";
import Button from "../../../../../UI/Button/Button";

const SearchCitizenTable = ({ data, setOpen, setReportingCitizen }) => {
  const columns = [
    {
      title: "",
      dataIndex: null,
      render: (citizen) => (
        <Button
          text="Select"
          type="primary"
          onClick={() => {
            setReportingCitizen(citizen);
            setOpen(false);
          }}
        />
      ),
    },
    {
      title: "Account ID",
      dataIndex: "accountId",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Birth date",
      dataIndex: "birthdate",
      render: (birthdate) => moment(birthdate).format("lll"),
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
      rowKey={"accountId"}
      dataSource={data}
      columns={columns}
      scroll={{ y: "35vh", x: "100vh" }}
    />
  );
};

export default SearchCitizenTable;
