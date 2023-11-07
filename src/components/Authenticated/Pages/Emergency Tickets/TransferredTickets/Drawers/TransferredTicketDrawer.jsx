import { Drawer } from "antd";
import React from "react";
import Button from "../../../../../UI/Button/Button";
import TicketInformation from "../TicketInformation";

const TransferredTicketDrawer = ({
  selectedTransferredTicket,
  closeDrawer,
  open,
  changeTransferStatus,
}) => {
  return (
    <Drawer
      height={"80vh"}
      onClose={closeDrawer}
      open={open}
      placement="bottom"
      title="Transferred ticket"
      footer={
        <div className="flex flex-row justify-end gap-1">
          <Button
            text="Decline"
            type="danger"
            onClick={() =>
              changeTransferStatus(selectedTransferredTicket.id, "decline")
            }
          />
          <Button
            text="Accept"
            type="primary"
            onClick={() =>
              changeTransferStatus(selectedTransferredTicket.id, "accept")
            }
          />
        </div>
      }
    >
      <div className="max-w-[900px] w-full mx-auto"></div>
      <TicketInformation reportData={selectedTransferredTicket} />
    </Drawer>
  );
};

export default TransferredTicketDrawer;
