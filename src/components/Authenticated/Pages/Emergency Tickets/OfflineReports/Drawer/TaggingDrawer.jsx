import { Table } from "ant-table-extensions";
import { Drawer, Popconfirm, Tag, message } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchFunction } from "../../../../../../helpers/searchFunction";
import { tagOfflineReport } from "../../../../../../store/api/ticket-api";
import { ticketsActions } from "../../../../../../store/store";
import Badge from "../../../../../UI/Badge/Badge";
import Button from "../../../../../UI/Button/Button";

const { fetchOfflineReports } = ticketsActions;

const TaggingDrawer = ({ open, onClose, selectedOfflineReport }) => {
  const dispatch = useDispatch();
  const [tagLoading, setTagLoading] = useState(false);
  const { acceptedTickets, fetchAcceptedTicketLoading } = useSelector(
    (state) => state.tickets
  );
  const tagReportHandler = async (transactionNumber) => {
    setTagLoading(true);
    const result = await tagOfflineReport({
      body: { reportId: selectedOfflineReport.id, transactionNumber },
    });
    if (!result || result.name === "AxiosError") {
      message.error(result?.response.data.message);
    } else {
      message.success(result.data.message);
      if (result.data.info) message.info(result.data.info, 5);

      dispatch(fetchOfflineReports());
      onClose();
    }

    setTagLoading(false);
  };
  const columns = [
    {
      width: "150px",
      title: "",
      dataIndex: null,
      render: (data) => {
        return (
          <Popconfirm
            okButtonProps={{
              className:
                "border-primary-900 bg-primary-700 hover:bg-primary-800 text-gray-100",
            }}
            title="Tag report"
            description="Tag offline report by response team into this ticket?"
            onConfirm={() => tagReportHandler(data.transactionNumber)}
          >
            <Button type="primary" text="Select" loading={tagLoading} />
          </Popconfirm>
        );
      },
    },
    {
      width: "200px",
      title: "Type",
      dataIndex: "typeName",
      render: (data) => <Badge type="caseType" text={data} />,
    },
    {
      width: "150px",
      title: "Injury",
      dataIndex: "withInjury",
      render: (data) => (
        <Badge type={data === 0 ? "withoutInjury" : "withInjury"} />
      ),
    },
    {
      width: "200px",
      title: "Ticket Number",
      dataIndex: "transactionNumber",
      render: (data) => <nobr>{data}</nobr>,
    },

    {
      width: "150px",
      title: "Citizen",
      dataIndex: null,
      render: (data) => (
        <div className="flex flex-col items-center">
          <span>{`${data.firstName} ${data.lastName}`}</span>
          {!data.callerId && (
            <div>
              <Tag color="red" className="mx-0">
                Non-registered
              </Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      width: "150px",
      title: "Mobile",
      dataIndex: "mobileNumber",
    },
    {
      width: "150px",
      title: "Date",
      dataIndex: "dateCreated",
      render: (data) => moment(data).format("lll"),
      sorter: (a, b) => {
        return a.dateCreated.localeCompare(b.Created);
      },
      defaultSortOrder: "descend",
      sortDirections: ["ascend", "descend", "ascend"],
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      width: "150px",
    },
    {
      title: "Address",
      dataIndex: "address",
      width: "150px",
    },
  ];
  return (
    <Drawer
      title={"Tag Report"}
      height={"80vh"}
      placement="bottom"
      onClose={onClose}
      open={open}
    >
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
        rowKey={"transactionNumber"}
        columns={columns}
        loading={fetchAcceptedTicketLoading}
        dataSource={acceptedTickets}
        scroll={{ y: "50vh", x: "100vw" }}
      />
    </Drawer>
  );
};

export default TaggingDrawer;
