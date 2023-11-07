import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ticketsActions } from "../../../../../../store/store";
import ResponseTeam from "./ResponseTeam";

const { fetchAssignedResponseTeams } = ticketsActions;

const AssignedResponseTeams = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.auth);
  const { selectedAcceptedTicket, assignedResponseTeams } = useSelector(
    (state) => state.tickets
  );
  useEffect(() => {
    if (selectedAcceptedTicket?.transactionNumber)
      dispatch(
        fetchAssignedResponseTeams({
          param: selectedAcceptedTicket?.transactionNumber,
        })
      );
  }, [selectedAcceptedTicket?.transactionNumber]);

  useEffect(() => {
    if (socket) {
      socket.on("dept_assign_update", async (data) => {
        if (
          data.transactionNumber === selectedAcceptedTicket?.transactionNumber
        ) {
          dispatch(
            fetchAssignedResponseTeams({
              param: selectedAcceptedTicket?.transactionNumber,
            })
          );
        }
      });
    }
    return () => {
      if (socket) socket.off("dept_assign_update");
    };
  }, [socket, selectedAcceptedTicket?.transactionNumber]);

  if (!assignedResponseTeams?.length)
    return <span className="text-gray-500">No response team assigned yet</span>;
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {assignedResponseTeams.map((rt, idx) => (
        <ResponseTeam key={idx} rt={rt} />
      ))}
    </div>
  );
};

export default AssignedResponseTeams;
