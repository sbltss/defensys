import { Drawer } from "antd";
import React from "react";
import TicketInformation from "../TicketInformation";

const DeclinedDrawer = ({ selectedDeclinedTicket, onClose }) => {
  return (
    <>
      <Drawer
        title={"Ticket Information"}
        height={"94vh"}
        placement="bottom"
        onClose={onClose}
        open={!!selectedDeclinedTicket}
      >
        <div className="max-w-[900px] w-full mx-auto">
          <TicketInformation reportData={selectedDeclinedTicket} />
        </div>
      </Drawer>
    </>
  );
};

export default DeclinedDrawer;
