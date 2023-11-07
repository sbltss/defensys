import React from "react";
import { Tabs } from "antd";
import ReportItem from "./ReportItem/ReportItem";
const Reports = ({ tickets }) => {
  const items = [
    {
      key: "1",
      label: `Pending`,
      children: <ReportList tickets={tickets.filter((t) => t.status === 0)} />,
    },
    {
      key: "2",
      label: `Ongoing`,
      children: <ReportList tickets={tickets.filter((t) => t.status === 1)} />,
    },
    {
      key: "3",
      label: `Resolved`,
      children: <ReportList tickets={tickets.filter((t) => t.status === 2)} />,
    },
    {
      key: "4",
      label: `Cancelled`,
      children: <ReportList tickets={tickets.filter((t) => t.status === -1)} />,
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} />;
};

const ReportList = ({ tickets }) => {
  return (
    <div className="flex flex-col gap-2">
      {tickets.map((ticket) => (
        <ReportItem key={ticket.transactionNumber} ticket={ticket} />
      ))}
    </div>
  );
};

export default Reports;
