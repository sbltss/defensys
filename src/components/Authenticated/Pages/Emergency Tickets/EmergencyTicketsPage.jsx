import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resourcesActions, ticketsActions } from "../../../../store/store";
import Button from "../../../UI/Button/Button";
import AcceptedTickets from "./AcceptedTickets/AcceptedTickets";
import DeclinedTickets from "./DeclinedTickets/DeclinedTickets";
import NewTicketDrawer from "./NewTicketDrawer/NewTicketDrawer";
import OfflineReports from "./OfflineReports/OfflineReports";
import PendingTickets from "./PendingTickets/PendingTickets";
import ReportedTickets from "./ReportedTickets/ReportedTickets";
import ReportsOfTheDay from "./ReportsOfTheDay/ReportsOfTheDay";
import ArchivedReportsOfTheDay from "./ArchivedReportsOfTheDay/ArchivedReportsOfTheDay";
import SupervisorTickets from "./SupervisorTickets/SupervisorTickets";
import TransferredTickets from "./TransferredTickets/TransferredTickets";
import NewReportofTheDayDrawer from "./NewReportofTheDay/NewReportofTheDayDrawer";
const {
  setSelectedTab,
  fetchPendingTickets,
  fetchAcceptedTickets,
  fetchReportedTickets,
  fetchDeclinedTickets,
  fetchReportsOfTheDay,
  fetchSupervisorTickets,
  fetchOfflineReports,
} = ticketsActions;
const { fetchResources } = resourcesActions;

const agentItems = [
  { key: "pending", label: "Pending", children: <PendingTickets /> },
  { key: "accepted", label: "Accepted", children: <AcceptedTickets /> },
  { key: "reported", label: "Reported", children: <ReportedTickets /> },
  {
    key: "transferred",
    label: "Transferred",
    children: <TransferredTickets />,
  },
  {
    key: "reportsOfTheDay",
    label: "Reports of the day",
    children: <ReportsOfTheDay />,
  },
];
const departmentItems = [
  { key: "pending", label: "Pending", children: <PendingTickets /> },
  { key: "accepted", label: "Accepted", children: <AcceptedTickets /> },
  { key: "declined", label: "Declined", children: <DeclinedTickets /> },
  {
    key: "offlineReports",
    label: "Offline Reports",
    children: <OfflineReports />,
  },
  {
    key: "reportsOfTheDay",
    label: "Reports of the day",
    children: <ReportsOfTheDay />,
  },
];
const supervisorItems = [
  { key: "pending", label: "Pending", children: <PendingTickets /> },
  { key: "tickets", label: "Ongoing", children: <SupervisorTickets /> },
  {
    key: "reportsOfTheDay",
    label: "Reports of the day",
    children: <ReportsOfTheDay />,
  },
  { key: "reported", label: "Reported", children: <ReportedTickets /> },
  {
    key: "archived",
    label: "Archived Reports of The Day",
    children: <ArchivedReportsOfTheDay />,
  },
];

const contentWriterItems = [
  { key: "tickets", label: "Ongoing", children: <SupervisorTickets /> },
  {
    key: "reportsOfTheDay",
    label: "Reports of the day",
    children: <ReportsOfTheDay />,
  },
  {
    key: "archived",
    label: "Archived Reports of The Day",
    children: <ArchivedReportsOfTheDay />,
  },
];

const EmergencyTicketsPage = () => {
  const [isAddNewTicket, setIsAddNewTicket] = useState(false);
  const [addNewReportOfTheDay, setAddNewReportOfTheDay] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const resources = useSelector((state) => state.resources);
  const { selectedTab } = useSelector((state) => state.tickets);

  useEffect(() => {
    if (currentUser.accountType === "supervisor")
      dispatch(setSelectedTab("tickets"));
    else if (currentUser.accountType === "contentwriter")
      dispatch(setSelectedTab("tickets"));
  }, [currentUser?.accountType, dispatch]);

  return (
    <>
      <NewTicketDrawer open={isAddNewTicket} setOpen={setIsAddNewTicket} />
      <NewReportofTheDayDrawer
        open={addNewReportOfTheDay}
        setOpen={setAddNewReportOfTheDay}
      />
      <div className="h-full">
        <Tabs
          type="card"
          items={
            currentUser.accountType === "agent"
              ? agentItems
              : currentUser.accountType === "department"
              ? departmentItems
              : currentUser.accountType === "supervisor"
              ? supervisorItems
              : contentWriterItems
          }
          animated
          activeKey={selectedTab}
          onChange={(e) => dispatch(setSelectedTab(e))}
          tabBarExtraContent={{
            right: (
              <>
                {currentUser.accountType === "agent" && (
                  <Button
                    type="primary"
                    text="New Ticket"
                    onClick={() => setIsAddNewTicket(true)}
                  />
                )}
                {/* {["supervisor", "contentwriter"].includes(
                  currentUser.accountType
                ) && (
                  <Button
                    type="primary"
                    text="New Report of The Day"
                    onClick={() => setAddNewReportOfTheDay(true)}
                  />
                )} */}
              </>
            ),
          }}
        />
      </div>
    </>
  );
};

export default EmergencyTicketsPage;
