import { Tag, Typography } from "antd";
import React from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { chatActions, ticketsActions } from "../../../../store/store";
import { useNavigate } from "react-router-dom";

const { selectChatTicket } = chatActions;
const { setSelectedTab, selectPendingTicket, readTicket } = ticketsActions;
const NotificationPanel = ({
  notifOpen,
  ticketNotifs,
  chatNotifs,
  setNotifOpen,
  updateChatNotif,
}) => {
  const { acceptedTickets } = useSelector((state) => state.tickets);
  return (
    <div className="py-2 bg-white shadow-lg w-96 rounded-lg flex flex-col justify-start leading-none gap-2">
      <div className="px-4">
        <span className="text-2xl font-semibold">
          {notifOpen === "chat"
            ? "Chats"
            : notifOpen === "ticket"
            ? "Emergency Tickets"
            : ""}
        </span>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[80vh]">
        {notifOpen === "ticket" && (
          <>
            {ticketNotifs.map((notif) => (
              <TicketNotif
                key={notif.transactionNumber}
                data={notif}
                setNotifOpen={setNotifOpen}
              />
            ))}
          </>
        )}
        {notifOpen === "chat" && (
          <>
            {chatNotifs.map((notif) => {
              if (
                acceptedTickets.filter(
                  (t) => t.transactionNumber === notif.transactionNumber
                ).length === 0
              )
                return null;
              return (
                <ChatNotif
                  key={notif.id}
                  data={notif}
                  setNotifOpen={setNotifOpen}
                  updateChatNotif={updateChatNotif}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

const ChatNotif = ({ data, setNotifOpen, updateChatNotif }) => {
  const dispatch = useDispatch();
  const {
    content,
    citizenName,
    rtName,
    deptName,
    agentName,
    dateCreated,
    msgType,
    transactionNumber,
  } = data;

  const { acceptedTickets } = useSelector((state) => state.tickets);
  const openChatHandler = () => {
    dispatch(
      selectChatTicket(
        acceptedTickets.filter(
          (t) => t.transactionNumber === transactionNumber
        )[0]
      )
    );
    setNotifOpen(false);
    updateChatNotif();
  };
  return (
    <div
      className="flex flex-col justify-center rounded-md gap-1 mx-2 px-1 cursor-pointer hover:bg-gray-100"
      onClick={openChatHandler}
    >
      <div>
        <Tag color="#1e40af">
          <span className="text-gray-100 font-medium">
            {`${rtName || deptName || agentName || citizenName} (${
              rtName
                ? "Response Team"
                : deptName
                ? "Department"
                : agentName
                ? "Dispatcher"
                : "Citizen"
            })`}
          </span>
        </Tag>
        <div className="text-sm flex flex-col gap-1">
          <Typography.Paragraph className="mb-0" ellipsis={{ rows: 2 }}>
            {msgType === "msg" ? content : "Sent an image"}
          </Typography.Paragraph>
          <span className="text-xs text-gray-600">
            {moment(dateCreated).format("LLL")}
          </span>
        </div>
      </div>
    </div>
  );
};
const TicketNotif = ({ data, setNotifOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pendingTickets } = useSelector((state) => state.tickets);
  const {
    caseTypeDesc,
    firstName,
    lastName,
    address,
    dateCreated,
    transactionNumber,
  } = data;
  const openTicketHandler = () => {
    dispatch(setSelectedTab("pending"));
    dispatch(
      selectPendingTicket(
        pendingTickets.filter(
          (t) => t.transactionNumber === transactionNumber
        )[0]
      )
    );
    dispatch(readTicket(transactionNumber));
    setNotifOpen(false);
    navigate("emergencyTickets");
  };
  return (
    <div
      className="flex flex-col justify-center rounded-md gap-1 mx-2 px-1 cursor-pointer hover:bg-gray-100"
      onClick={openTicketHandler}
    >
      <div>
        <Tag color="#991b1b">
          <span className="text-gray-100 font-medium">
            {`${
              caseTypeDesc || "Pending Information"
            } (${firstName} ${lastName})`}
          </span>
        </Tag>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-800">{address}</span>
          <span className="text-xs text-gray-600">
            {moment(dateCreated).format("LLL")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
