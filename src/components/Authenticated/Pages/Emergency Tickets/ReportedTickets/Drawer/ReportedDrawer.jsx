import React from "react";
import TicketInformation from "../TicketInformation";
import { Drawer } from "antd";

const ReportedDrawer = ({ selectedReportedTicket, onClose }) => {
  return (
    <Drawer
      title={"Ticket Information"}
      height={"94vh"}
      placement="bottom"
      onClose={onClose}
      open={!!selectedReportedTicket}
    >
      <div className="max-w-[900px] w-full mx-auto">
        <TicketInformation reportData={selectedReportedTicket} />
      </div>
    </Drawer>
  );
};

export default ReportedDrawer;
