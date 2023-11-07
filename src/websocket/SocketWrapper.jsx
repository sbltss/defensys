import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ticketsActions, chatActions } from "../store/store";
import { Image, Tag, Typography, message, notification } from "antd";
import { ChatBoldIcon, TicketBoldIcon } from "../assets/icons/Icons";
import moment from "moment";
// import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
const {
  // ticketAssigned,
  ticketReported,
  updatePendingTickets,
  removePendingTicket,
  fetchAcceptedTickets,
  fetchPendingTickets,
  setSelectedTab,
  readTicket,
  // selectAcceptedTicket,
  selectPendingTicket,
  fetchChatNotifs,
  fetchAssignedResponseTeams,
  updateAcceptedTickets,
  updateOfflineReports,
} = ticketsActions;

const { updateChats, selectChatTicket } = chatActions;

const SocketWrapper = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();
  const pendingTicketRef = useRef(null);
  const pendingTicketsRef = useRef(null);
  const selectedChatTicketRef = useRef(null);
  const acceptedTicketRef = useRef(null);
  const acceptedTicketsRef = useRef(null);
  const dispatch = useDispatch();
  const { socket, currentUser } = useSelector((state) => state.auth);
  const { selectedChatTicket } = useSelector((state) => state.chat);
  const {
    selectedPendingTicket,
    selectedAcceptedTicket,
    acceptedTickets,
    pendingTickets,
  } = useSelector((state) => state.tickets);

  const navigate = useNavigate();

  useEffect(() => {
    pendingTicketRef.current = selectedPendingTicket?.transactionNumber;
  }, [selectedPendingTicket?.transactionNumber]);

  useEffect(() => {
    acceptedTicketRef.current = selectedAcceptedTicket;
  }, [selectedAcceptedTicket]);

  useEffect(() => {
    selectedChatTicketRef.current = selectedChatTicket;
  }, [selectedChatTicket?.transactionNumber]);

  useEffect(() => {
    acceptedTicketsRef.current = acceptedTickets;
  }, [acceptedTickets]);

  useEffect(() => {
    pendingTicketsRef.current = pendingTickets;
  }, [pendingTickets]);

  useEffect(() => {
    if (socket) {
      socket.on("new_chat", (data) => {
        dispatch(fetchChatNotifs());
        if (
          data.transactionNumber ===
          selectedChatTicketRef.current?.transactionNumber
        ) {
          dispatch(updateChats(data));
        } else if (
          currentUser !== data.sender &&
          acceptedTicketsRef.current.filter(
            (t) => t.transactionNumber === data.transactionNumber
          ).length > 0
        ) {
          const {
            rtName,
            deptName,
            agentName,
            constituentName,
            msgType,
            content,
            dateCreated,
            transactionNumber,
          } = data;
          api.open({
            message: (
              <>
                <Tag color="#1e40af">
                  <span className="text-gray-100 font-medium">
                    {`${rtName || deptName || agentName || constituentName} (${
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
              </>
            ),
            description: (
              <>
                <div className="text-sm flex flex-col gap-1">
                  <Typography.Paragraph className="mb-0" ellipsis={{ rows: 2 }}>
                    {msgType === "msg" ? content : "Sent an image"}
                  </Typography.Paragraph>
                  <span className="text-xs text-gray-600">
                    {moment(dateCreated).format("LLL")}
                  {/* {moment(dateCreated).tz('Asia/Manila').format("LLL")} */}
                  </span>
                </div>
              </>
            ),
            duration: 0,
            icon: <ChatBoldIcon />,
            key: transactionNumber,
            onClick: () => {
              dispatch(
                selectChatTicket(
                  acceptedTicketsRef.current.filter(
                    (t) => t.transactionNumber === transactionNumber
                  )[0]
                )
              );
              api.destroy(transactionNumber);
            },
            className: "cursor-pointer",
          });
        }
      });
      if (currentUser.accountType === "agent") {
        socket.on("pendingTickets", (data) => {
          if (
            data.action === "update" &&
            currentUser?.commandCenterId === data?.data?.commandCenterId
          ) {
            const {
              caseTypeDesc,
              caseTypeIcon,
              address,
              content,
              dateCreated,
              transactionNumber,
              status,
            } = data.data;
            if (status == 0)
              api.open({
                message: (
                  <>
                    <Tag color="#1e40af">
                      <span className="text-gray-100 font-medium">
                        {caseTypeDesc}
                      </span>
                    </Tag>
                  </>
                ),
                description: (
                  <div className="flex flex-row gap-1 items-center justify-center">
                    {caseTypeIcon && (
                      <div className="h-20">
                        <Image
                          className="h-full w-full"
                          alt={caseTypeDesc}
                          src={
                            import.meta.env.VITE_BASE_URL + "/" + caseTypeIcon
                          }
                        />
                      </div>
                    )}
                    <div className="text-sm flex flex-col gap-1">
                      <span className="text-sm text-gray-600">
                        {`Content: ${content}`}
                      </span>

                      <span className="text-sm text-gray-600">{address}</span>
                      <span className="text-xs text-gray-600">
                      {/* {moment(dateCreated).tz('Asia/Manila').format("LLL")} */}
                        {moment(dateCreated).format("LLL")}
                      </span>
                    </div>
                  </div>
                ),
                duration: 0,
                key: transactionNumber,
                onClick: () => {
                  if (
                    pendingTicketsRef.current.filter(
                      (t) =>
                        t.transactionNumber === transactionNumber &&
                        (t.isRead == 0 || t.isRead === currentUser.accountId)
                    ).length > 0
                  ) {
                    navigate("/emergencyTickets");
                    dispatch(setSelectedTab("pending"));
                    dispatch(selectPendingTicket(data.data));
                    dispatch(readTicket(data.data.transactionNumber));
                  } else {
                    message.info(
                      "Ticket is already taken by another dispatcher"
                    );
                  }
                  api.destroy(transactionNumber);
                },
                className: "cursor-pointer",
              });
            console.log({...data.data})
            dispatch(updatePendingTickets(data.data));
          }
          if (data.action === "remove") {
            dispatch(removePendingTicket(data.data));
          }
        });
        socket.on("ticket_reported", (data) => {
          dispatch(ticketReported(data));
        });
        socket.on("my_tickets_update", (data) => {
          dispatch(fetchAcceptedTickets());
          dispatch(updateAcceptedTickets(data));
        });
      } else if (currentUser.accountType === "department") {
        socket.on("pending_tickets_update", (data) => {
          dispatch(fetchPendingTickets());
        });
        socket.on("offline_reports", (data) => {
          if (data.action === "add") {
            dispatch(updateOfflineReports(data.data));
          }
        });
        socket.on("my_tickets_update", (data) => {
          dispatch(fetchAcceptedTickets());
        });
        socket.on("pendingTickets", (data) => {
          if (data.action === "add") {
            if (currentUser?.commandCenterId === data?.data?.commandCenterId)
              dispatch(updatePendingTickets(data.data));
          }
        });
        socket.on("assigned_rt_update", (data) => {
          if (
            acceptedTicketRef.current?.transactionNumber ===
            data.transactionNumber
          ) {
            dispatch(
              fetchAssignedResponseTeams({
                param: acceptedTicketRef.current?.transactionNumber,
              })
            );
          }
        });
      }
    }
    return () => {
      if (socket) {
        socket.off("new_chat");
        if (currentUser.accountType === "agent") {
          socket.off("pendingTickets");
          socket.off("ticket_reported");
          socket.off("my_tickets_update");
        } else if (currentUser.accountType === "department") {
          socket.off("offline_reports");
          socket.off("pending_tickets_update");
          socket.off("my_tickets_update");
          socket.off("assigned_rt_update");
        }
      }
    };
  }, [
    dispatch,
    socket,
    currentUser.accountType,
    currentUser.accountId,
    acceptedTicketRef.current?.transactionNumber,
    pendingTicketRef.current?.transactionNumber,
    selectedChatTicketRef.current?.transactionNumber,
  ]);
  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

export default SocketWrapper;
