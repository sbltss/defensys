import React, { useEffect } from "react";
import { searchFunction } from "../../../../../../helpers/searchFunction";
import { useDispatch, useSelector } from "react-redux";
import { resourcesActions } from "../../../../../../store/store";
import { Tag } from "antd";
import moment from "moment";
import Button from "../../../../../UI/Button/Button";
import { Table } from "ant-table-extensions";

const { updateResources } = resourcesActions;

const ResponderSelection = ({
  selectedResponders,
  setSelectedResponders,
  isSelectedList,
  disabled,
}) => {
  const dispatch = useDispatch();
  const resources = useSelector((state) => state.resources);
  const { responseTeamsList, isLoading } = resources;

  useEffect(() => {
    if (isSelectedList)
      dispatch(updateResources({ toFetch: ["responseTeamsList"] }));
  }, [isSelectedList]);

  const columns = [
    {
      title: "Action",
      dataIndex: null,
      render: (d) =>
        d?.latestPaymentLog?.status === "verification" ? (
          <div className="flex justify-center items-center">
            Pending Verification
          </div>
        ) : selectedResponders.includes(d.accountId) ? (
          <Button
            type={"danger"}
            text="Remove"
            onClick={() =>
              setSelectedResponders((prev) =>
                [...prev].filter((e) => e !== d.accountId)
              )
            }
            disabled={disabled}
          />
        ) : (
          <Button
            type={"primary"}
            text="Add"
            onClick={() =>
              setSelectedResponders((prev) => [...prev, d.accountId])
            }
          />
        ),
    },
    {
      title: "Name",
      dataIndex: null,
      render: (d) => `${d.firstName} ${d.lastName}`,
    },
    {
      title: "Payment Status",
      dataIndex: null,
      render: (data) => {
        if (!data.isVolunteer)
          return (
            <div className="flex justify-center items-center">
              <Tag color="gray">Non-voluntary</Tag>
            </div>
          );
        if (!data?.latestPaymentLog)
          return (
            <div className="flex justify-center items-center">
              <Tag color="gray">Pending</Tag>
            </div>
          );
        else {
          if (data?.latestPaymentLog.status === "rejected")
            return (
              <div className="flex justify-center items-center">
                <Tag color="red">Rejected</Tag>
              </div>
            );
          if (data?.latestPaymentLog.status === "verification")
            return (
              <div className="flex justify-center items-center">
                <Tag color="orange">For Verification</Tag>
              </div>
            );
          if (
            data?.latestPaymentLog.status === "approved" &&
            data?.latestPaymentLog.expiration <
              moment().format("YYYY-MM-DD HH:mm:ss")
          )
            return (
              <div className="flex justify-center items-center">
                <Tag color="red">Expired</Tag>
              </div>
            );
          if (
            data?.latestPaymentLog.status === "approved" &&
            data?.latestPaymentLog.expiration >
              moment().format("YYYY-MM-DD HH:mm:ss")
          )
            return (
              <div className="flex justify-center items-center">
                <Tag color="green">Paid</Tag>
              </div>
            );
        }
      },
      defaultSortOrder: "descend",
      sortDirections: ["descend", "ascend", "descend"],
      sorter: (a, b) => {
        let aVal = "";
        let bVal = "";
        if (!a.isVolunteer) aVal === "Non-voluntary";
        else if (!a.latestPaymentLog) aVal === "pending";
        else if (a.latestPaymentLog.status === "verification")
          aVal = "For Verification";
        else if (a?.latestPaymentLog.status === "rejected") aVal = "rejected";
        else if (
          a.latestPaymentLog.status === "approved" &&
          a.latestPaymentLog.expiration < moment().format("YYYY-MM-DD HH:mm:ss")
        )
          aVal = "Expired";
        else if (
          a.latestPaymentLog.status === "approved" &&
          a.latestPaymentLog.expiration > moment().format("YYYY-MM-DD HH:mm:ss")
        )
          aVal = "Paid";

        if (!b.isVolunteer) bVal === "Non-voluntary";
        else if (!b.latestPaymentLog) bVal === "pending";
        else if (b.latestPaymentLog.status === "verification")
          bVal = "For Verification";
        else if (b?.latestPaymentLog.status === "rejected") bVal = "rejected";
        else if (
          b.latestPaymentLog.status === "approved" &&
          b.latestPaymentLog.expiration < moment().format("YYYY-MM-DD HH:mm:ss")
        )
          bVal = "Expired";
        else if (
          b.latestPaymentLog.status === "approved" &&
          b.latestPaymentLog.expiration > moment().format("YYYY-MM-DD HH:mm:ss")
        )
          bVal = "Paid";

        return aVal.localeCompare(bVal);
      },
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
    {
      title: "Date Updated",
      dataIndex: "dateUpdated",
      render: (data) => moment(data).format("lll"),
    },
  ];
  return (
    <Table
      searchableProps={
        isSelectedList
          ? null
          : {
              searchFunction: searchFunction,
            }
      }
      pagination={{
        showSizeChanger: true,
        defaultPageSize: 10,
        pageSizeOptions: [10, 20, 50, 100],
      }}
      rowKey={"accountId"}
      columns={columns}
      loading={isLoading}
      dataSource={
        isSelectedList
          ? responseTeamsList.filter((e) =>
              selectedResponders.includes(e.accountId)
            )
          : responseTeamsList
      }
      scroll={{ y: "45vh", x: "100vw" }}
    />
  );
};

export default ResponderSelection;
