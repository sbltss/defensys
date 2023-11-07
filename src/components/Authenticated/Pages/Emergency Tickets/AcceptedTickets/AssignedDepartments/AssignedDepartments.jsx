import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ticketsActions } from "../../../../../../store/store";
import Department from "./Department/Department";

const { fetchAssignedDepartments } = ticketsActions;

const AssignedDepartments = () => {
  const dispatch = useDispatch();
  // const [assignedDepartments, setAssignedDepartments] = useState([]);
  const { currentUser } = useSelector((state) => state.auth);
  const {
    selectedAcceptedTicket,
    selectedSupervisorTickets,
    assignedDepartments,
  } = useSelector((state) => state.tickets);
  const { socket } = useSelector((state) => state.auth);

  useEffect(() => {
    if (currentUser.accountType === "agent") {
      if (selectedAcceptedTicket?.transactionNumber)
        dispatch(
          fetchAssignedDepartments(selectedAcceptedTicket?.transactionNumber)
        );
    } else if (currentUser.accountType === "supervisor") {
      if (selectedSupervisorTickets?.transactionNumber)
        dispatch(
          fetchAssignedDepartments(selectedSupervisorTickets?.transactionNumber)
        );
    }

    // const fetchAssignedDepartments = async (transactionNumber) => {
    //   const result = await getAssignedDepartments(transactionNumber);
    //   setAssignedDepartments(result.data);
    // };
    // if (selectedAcceptedTicket?.transactionNumber)
    //   fetchAssignedDepartments(selectedAcceptedTicket?.transactionNumber);
  }, [
    selectedAcceptedTicket?.transactionNumber,
    currentUser.accountType,
    selectedSupervisorTickets?.transactionNumber,
  ]);

  useEffect(() => {
    if (socket) {
      socket.on("dept_assign_update", async (data) => {
        if (
          data.transactionNumber === selectedAcceptedTicket?.transactionNumber
        ) {
          dispatch(
            fetchAssignedDepartments(selectedAcceptedTicket?.transactionNumber)
          );
        }
      });
    }
    return () => {
      if (socket) socket.off("dept_assign_update");
    };
  }, [socket, selectedAcceptedTicket?.transactionNumber]);

  if (!assignedDepartments?.length)
    return <span className="text-gray-500">No departments assigned yet</span>;
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {assignedDepartments.map((department) => (
        <Department key={department.id} department={department} />
      ))}
    </div>
  );
};

export default AssignedDepartments;
