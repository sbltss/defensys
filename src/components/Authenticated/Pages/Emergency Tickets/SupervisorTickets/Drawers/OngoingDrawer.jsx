import { Drawer } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ticketsActions } from "../../../../../../store/store";
import AssignedDepartments from "../../AcceptedTickets/AssignedDepartments/AssignedDepartments";
import TicketInformation from "../TicketInformation";

const { selectOngoingTicket } = ticketsActions;

const OngoingDrawer = () => {
  const dispatch = useDispatch();
  const { selectedSupervisorTickets } = useSelector((state) => state.tickets);
  const { socket } = useSelector((state) => state.auth);
  const onClose = () => {
    dispatch(selectOngoingTicket(null));
  };

  useEffect(() => {
    if (socket) {
      socket.on("responder_assign_update", (data) => {
        dispatch(selectOngoingTicket(data));
      });
    }

    return () => {
      if (socket) {
        socket.off("responder_assign_update");
      }
    };
  }, [dispatch, socket]);
  return (
    <>
      <Drawer
        title={"Ticket Information"}
        height={"80vh"}
        placement="bottom"
        onClose={onClose}
        open={selectedSupervisorTickets}
      >
        <div className="flex flex-row gap-4">
          <div className="max-w-[800px]">
            <TicketInformation reportData={selectedSupervisorTickets} />
          </div>
          <div className="flex-1">
            <AssignedDepartments />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default OngoingDrawer;
