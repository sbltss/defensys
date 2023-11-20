import { Drawer, Form, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ticketsActions, chatActions } from "../../../../../../store/store";
import Button from "../../../../../UI/Button/Button";
import AssignedDepartments from "../AssignedDepartments/AssignedDepartments";
import AssignedResponseTeams from "../AssignedResponseTeams/AssignedResponseTeams";
import TicketInformation from "../TicketInformation";
import AssignRTDrawer from "./AssignRTDrawer";
import AssignTicketDrawer from "./AssignTicketDrawer";
import MapDrawer from "./MapDrawer";
import ResolveTicketDrawer from "./ResolveTicketDrawer";
const { selectAcceptedTicket, setAssigning, resolveTicket } = ticketsActions;
const { selectChatTicket } = chatActions;

const AcceptedDrawer = () => {
  const [resolveForm] = Form.useForm();
  const [mapOpen, setMapOpen] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const dispatch = useDispatch();
  const {
    selectedAcceptedTicket,
    assigning,
    assignedResponseTeams,
    assignedDepartments,
    resolveTicketLoading,
  } = useSelector((state) => state.tickets);
  const { currentUser, socket } = useSelector((state) => state.auth);
  const onClose = () => {
    dispatch(selectAcceptedTicket(null));
  };
  const setAssigningHandler = (e) => {
    dispatch(setAssigning(e));
  };
  const resolveTicketFormHandler = (values) => {
    if (currentUser.accountType === "agent") {
      dispatch(
        resolveTicket({
          body: {
            remarks: values.remarks,
            transactionNumber: selectedAcceptedTicket.transactionNumber,
          },
          cb: () => {
            setIsResolving(false);
            resolveForm.resetFields();
          },
        })
      );
    } else if (currentUser.accountType === "department") {
      dispatch(
        resolveTicket({
          body: {
            remarks: values.remarks,
            personsInvolved: (values.personsInvolved || []).join(";"),
            address: values.address,
            latitude: values.lat,
            longitude: values.lng,
            transactionNumber: selectedAcceptedTicket.transactionNumber,
          },
          cb: () => {
            setIsResolving(false);
            resolveForm.resetFields();
          },
        })
      );
    }
  };
  useEffect(() => {
    if (socket) {
      socket.on("responder_assign_update", (data) => {
        dispatch(selectAcceptedTicket(data));
      });
    }

    return () => {
      if (socket) {
        socket.off("responder_assign_update");
      }
    };
  }, [dispatch, socket]);

  const validateResolve = () => {
    let isValid = false;
    if (currentUser.accountType === "agent") {
      const checkIfAllResolved = assignedDepartments.every(item => item.status === 3)
      if (checkIfAllResolved) setIsResolving(true)
      else message.warning("All department must be reported.")
    } else {
      assignedResponseTeams.forEach((rt) => {
        if (rt.status === 4) isValid = true;
      });

      if (isValid) setIsResolving(true);
      else message.warning("No response team has reported yet");
    }
  };

  console.log((currentUser.accountType === "agent" &&
  selectedAcceptedTicket?.status === 1))

  console.log(currentUser.accountType)
  console.log(selectedAcceptedTicket?.status)

  return (
    <>
      <Drawer
        title={"Ticket Information"}
        height={
          (!assignedResponseTeams?.length &&
            currentUser.accountType === "department") ||
          (!assignedDepartments?.length && currentUser.accountType === "agent")
            ? "80vh"
            : "90vh"
        }
        placement="bottom"
        onClose={onClose}
        open={selectedAcceptedTicket}
        footer={
          ((currentUser.accountType === "agent" &&
            selectedAcceptedTicket?.status === 1) ||
            (currentUser.accountType === "department" &&
              selectedAcceptedTicket?.ticketStatus === 1)) && (
            <div className="flex flex-row gap-2 w-full justify-end">
              <Button
                onClick={() =>
                  dispatch(selectChatTicket(selectedAcceptedTicket))
                }
                type="muted"
                text={"Open Conversation"}
              />
              <Button
                onClick={() => setMapOpen(true)}
                type="warning"
                text={"Open Map"}
              />
              <Button
                onClick={() => setAssigningHandler(true)}
                type="primary"
                text={
                  currentUser.accountType === "agent"
                    ? "Add Department"
                    : "Add response Team"
                }
              />
              <Button
                onClick={validateResolve}
                type="success"
                text={
                  currentUser.accountType === "agent"
                    ? "Resolve Ticket"
                    : "Set Ticket as Reported"
                }
              />
            </div>
          )
        }
      >
        <div className="flex flex-row gap-4">
          <div className="max-w-[800px] w-full">
            <TicketInformation reportData={selectedAcceptedTicket} />
          </div>

          <div className="flex-1">
            {currentUser.accountType === "agent" && <AssignedDepartments />}

            {currentUser.accountType === "department" && (
              <AssignedResponseTeams />
            )}
          </div>
        </div>
        <MapDrawer open={mapOpen} onClose={() => setMapOpen(false)} />
        <ResolveTicketDrawer
          onFinish={resolveTicketFormHandler}
          form={resolveForm}
          open={isResolving}
          setOpen={setIsResolving}
          title={
            currentUser.accountType === "agent"
              ? "Resolve Ticket"
              : "Set Ticket as Reported"
          }
          loading={resolveTicketLoading}
        />
        {currentUser.accountType === "agent" && (
          <AssignTicketDrawer
            assigning={assigning && selectedAcceptedTicket}
            setAssigning={setAssigningHandler}
            selectedTicket={selectedAcceptedTicket}
          />
        )}
        {currentUser.accountType === "department" && (
          <AssignRTDrawer
            assigning={assigning}
            setAssigning={setAssigningHandler}
            selectedTicket={selectedAcceptedTicket}
          />
        )}
      </Drawer>
    </>
  );
};

export default AcceptedDrawer;
