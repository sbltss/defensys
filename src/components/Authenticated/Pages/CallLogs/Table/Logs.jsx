import { Table } from "ant-table-extensions";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchFunction } from "../../../../../helpers/searchFunction";
import { callActions } from "../.././../../../store/store";
const { fetchCallLogs } = callActions;

const Logs = () => {
  const dispatch = useDispatch();
  const { callLogs, fetchCallLogsLoading } = useSelector((state) => state.call);
  useEffect(() => {
    dispatch(fetchCallLogs());
  }, []);
  const columns = [
    {
      title: "Caller",
      dataIndex: "callFrom",
      defaultSortOrder: "ascend",
      sorter: (a, b) =>
        a.callFrom?.toString().localeCompare(b.callFrom?.toString()),
    },
    {
      title: "Callee",
      dataIndex: "callTo",
      defaultSortOrder: "ascend",
      sorter: (a, b) =>
        a.callTo?.toString().localeCompare(b.callTo?.toString()),
    },
    {
      title: "Time Started",
      dataIndex: "start",
      render: (d) => moment(d).format("lll"),
    },
    {
      title: "Time Ended",
      dataIndex: "end",
      render: (d) => moment(d).format("lll"),
    },
    {
      title: "Duration",
      dataIndex: null,
      render: (d) => {
        const firstDate = moment(d.end);
        const secondDate = moment(d.start);
        const hourDiff = firstDate.diff(secondDate, "hours");
        const minuteDiff = firstDate.diff(secondDate, "minutes");
        const secDiff = firstDate.diff(secondDate, "seconds");
        return hourDiff + ":" + (minuteDiff % 60) + ":" + (secDiff % 60);
      },
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
      loading={fetchCallLogsLoading}
      dataSource={callLogs.map((c, idx) => ({ ...c, id: idx }))}
      scroll={{ y: "60vh", x: "100vw" }}
    />
  );
};

export default Logs;
