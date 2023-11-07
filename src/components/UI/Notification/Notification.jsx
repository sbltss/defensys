import React from "react";
import NotificationButton from "./NotificationButton";
import { ChatBoldIcon, TicketBoldIcon } from "../../../assets/icons/Icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { ticketsActions } from "../../../store/store";
import NotificationPanel from "./NotificationPanel/NotificationPanel";
import { useState } from "react";
const { fetchTicketNotifs, fetchChatNotifs } = ticketsActions;

const Notification = () => {
  const [notifOpen, setNotifOpen] = useState(null);
  const dispatch = useDispatch();
  const { ticketNotifs, chatNotifs, acceptedTickets, pendingTickets } =
    useSelector((state) => state.tickets);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTicketNotifs());
    dispatch(fetchChatNotifs());
  }, [dispatch]);

  const updateChatNotif = () => {
    dispatch(fetchChatNotifs());
  };

  return (
    <>
      <div className="flex flex-row gap-1 items-center justify-center">
        <NotificationButton
          Icon={TicketBoldIcon}
          count={
            currentUser === "department"
              ? pendingTickets.length
              : pendingTickets.filter((t) => !t.isRead).length
          }
          setNotifOpen={setNotifOpen}
          type="ticket"
          notifOpen={notifOpen}
        />
        <NotificationButton
          Icon={ChatBoldIcon}
          count={
            (chatNotifs || []).filter(
              (c) =>
                acceptedTickets.filter(
                  (t) => t.transactionNumber === c.transactionNumber
                ).length > 0
            ).length
          }
          setNotifOpen={setNotifOpen}
          type="chat"
          notifOpen={notifOpen}
        />
        {!!notifOpen && (
          <div
            className={`fixed right-4 z-[99999] ${
              currentUser.isDemo ? " top-20 " : " top-12 "
            }`}
          >
            <NotificationPanel
              notifOpen={notifOpen}
              ticketNotifs={
                currentUser === "department"
                  ? pendingTickets
                  : pendingTickets.filter((t) => !t.isRead)
              }
              chatNotifs={chatNotifs}
              setNotifOpen={setNotifOpen}
              updateChatNotif={updateChatNotif}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Notification;
