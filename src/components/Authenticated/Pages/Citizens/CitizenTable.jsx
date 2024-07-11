import { Table } from "ant-table-extensions";
import React from "react";
import { searchFunction } from "../../../../helpers/searchFunction";
import moment from "moment";

const CitizenTable = ({ citizens, loading }) => {
  console.log(citizens);
  const columns = [
    {
      title: "Account ID",
      dataIndex: "accountId",
    },
    {
      title: "Full Name",
      dataIndex: null,
      render: (d) => {
        const nameArr = [];
        if (d.firstName) nameArr.push(d.firstName);
        if (d.middleName) nameArr.push(d.middleName);
        if (d.lastName) nameArr.push(d.lastName);
        if (d.suffix) nameArr.push(d.suffix);
        return nameArr.join(" ");
      },
    },
    {
      title: "Gender",
      dataIndex: "sex",
      render: (e) => {
        if (e == 0) return "Male";
        if (e == 1) return "Female";
      },
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Email Address",
      dataIndex: "primaryEmail",
      render: (email) => {
        if (email === "no-email@gmail.com") return "No Email";
        return email;
      },
    },
    {
      title: "Birthdate",
      dataIndex: "birthdate",
      render: (e) => {
        return moment(e).format("MMMM DD, YYYY");
      },
    },
    {
      title: "Phone Number",
      dataIndex: "primaryMobile",
    },
  ];
  return (
    <Table
      exportable={true}
      exportableProps={{
        fileName: "Citizens",
        dataSource: citizens.map((c) => ({
          ...c,
          sex: c.sex == 0 ? "Male" : "Female",
          primaryEmail:
            c.primaryEmail === "no-email@gmail.com"
              ? "No Email"
              : c.primaryEmail,
        })),
      }}
      searchableProps={{
        searchFunction: searchFunction,
      }}
      searchable={true}
      pagination={{
        showSizeChanger: true,
        defaultPageSize: 10,
        pageSizeOptions: [10, 20, 50, 100],
        showTotal: (total, range) =>
          `${range[0]} - ${range[1]} of ${total} items`,
      }}
      rowKey={"accountId"}
      dataSource={citizens}
      columns={columns}
      loading={loading}
      scroll={{ y: "40vh", x: "100vw" }}
    />
  );
};

export default CitizenTable;
