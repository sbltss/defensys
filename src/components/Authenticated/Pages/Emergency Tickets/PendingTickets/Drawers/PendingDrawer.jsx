import { Drawer } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ticketsActions } from "../../../../../../store/store";
import Button from "../../../../../UI/Button/Button";
import MenuButton from "../../../../../UI/Menu/MenuButton";
import TicketInformation from "../TicketInformation";
import AssignTicketDrawer from "./AssignTicketDrawer";
import BlockingDrawer from "./BlockingDrawer";
import DeclineTicketDrawer from "./DeclineTicketDrawer";
import ReportTicketDrawer from "./ReportTicketDrawer";
const {
  selectPendingTicket,
  unreadTicket,
  setAssigning,
  setReporting,
  setBlocking,
  reportTicket,
  blockCitizen,
  acceptTicket,
} = ticketsActions;

const PendingDrawer = () => {
  const {
    selectedPendingTicket,
    assigning,
    reporting,
    blocking,
    acceptTicketLoading,
    declineTicketLoading,
  } = useSelector((state) => state.tickets);
  const { currentUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [declining, setDeclining] = useState(false);
  const setAssigningHandler = (e) => {
    dispatch(setAssigning(e));
  };
  const setReportingHandler = (e) => {
    dispatch(setReporting(e));
  };
  const setBlockingHandler = (e) => {
    dispatch(setBlocking(e));
  };

  const onClose = () => {
    dispatch(selectPendingTicket(null));
  };
  const unreadTicketHandler = () => {
    dispatch(unreadTicket(selectedPendingTicket.transactionNumber));
  };
  const reportTicketHandler = (e) => {
    if (e === "Others") {
      dispatch(setReporting(e));
      // const payload = {param:selectedPendingTicket?.transactionNumber, body:{
      //   reason:e,
      //   status:-1
      // }}
    } else if (e === "Resolved By Agent") {
      dispatch(setReporting(e));
      // const payload = {param:selectedPendingTicket?.transactionNumber, body:{
      //   reason:e,
      //   status:2
      // }}
    } else {
      const payload = {
        param: selectedPendingTicket?.transactionNumber,
        body: {
          reason: e,
          status: -1,
        },
      };
      dispatch(reportTicket(payload));
    }
  };
  const blockingHandler = (e) => {
    if (e === "Others") {
      dispatch(setBlocking(e));
      // const payload = {param:selectedPendingTicket?.transactionNumber, body:{
      //   reason:e,
      //   status:-1
      // }}
    } else {
      const payload = {
        accountId: selectedPendingTicket.callerId,
        reason: e,
      };
      dispatch(blockCitizen(payload));
    }
  };

  return (
    <>
      <Drawer
        title={"Ticket Information"}
        height={"94vh"}
        placement="bottom"
        onClose={onClose}
        open={!!selectedPendingTicket}
        footer={
          currentUser.accountType === "agent" ? (
            <div className="flex flex-row gap-2 w-full justify-end">
              <Button
                onClick={() => setAssigningHandler(true)}
                type="primary"
                text="Assign Ticket"
              />
              <MenuButton type="danger" text="Report Ticket" anchor="topRight">
                <Button
                  onClick={() => reportTicketHandler("Redundant Report")}
                  type="menu"
                  text="Redundant Report"
                />
                <Button
                  onClick={() => reportTicketHandler("Malicious Report")}
                  type="menu"
                  text="Malicious Report"
                />
                <Button
                  onClick={() => reportTicketHandler("False Report")}
                  type="menu"
                  text="False Report"
                />
                <Button
                  onClick={() => reportTicketHandler("Resolved By Agent")}
                  type="menu"
                  text="Resolved By Dispatcher"
                />
                <Button
                  onClick={() => reportTicketHandler("Others")}
                  type="menu"
                  text="Others"
                />
              </MenuButton>
              {selectedPendingTicket?.callerId && (
                <MenuButton
                  type="warning"
                  text="Block Citizen"
                  anchor="topRight"
                >
                  <Button
                    onClick={() =>
                      blockingHandler("Repetitious Nuissance Report")
                    }
                    type="menu"
                    text="Repetitious Nuissance Report"
                  />
                  <Button
                    onClick={() => blockingHandler("Repetitious False Report")}
                    type="menu"
                    text="Repetitious False Report"
                  />
                  <Button
                    onClick={() => blockingHandler("Others")}
                    type="menu"
                    text="Others"
                  />
                </MenuButton>
              )}
              <Button
                onClick={unreadTicketHandler}
                type="warning"
                text="Revert"
              />
            </div>
          ) : currentUser.accountType === "department" ? (
            <div className="flex flex-row gap-2 w-full justify-end">
              <Button
                loading={acceptTicketLoading}
                disabled={declineTicketLoading}
                onClick={() =>
                  dispatch(
                    acceptTicket({
                      param: selectedPendingTicket.transactionNumber,
                    })
                  )
                }
                type="primary"
                text="Accept Ticket"
              />

              <Button
                loading={declineTicketLoading}
                disabled={acceptTicketLoading}
                onClick={() => setDeclining(true)}
                type="warning"
                text="Decline Ticket"
              />
              {/* {selectedPendingTicket?.callerId && (
                <MenuButton
                  disabled={acceptTicketLoading || declineTicketLoading}
                  type="warning"
                  text="Block Citizen"
                  anchor="topRight"
                >
                  <Button
                    onClick={() =>
                      blockingHandler("Repetitious Nuissance Report")
                    }
                    type="menu"
                    text="Repetitious Nuissance Report"
                  />
                  <Button
                    onClick={() => blockingHandler("Repetitious False Report")}
                    type="menu"
                    text="Repetitious False Report"
                  />
                  <Button
                    onClick={() => blockingHandler("Others")}
                    type="menu"
                    text="Others"
                  />
                </MenuButton>
              )} */}
            </div>
          ) : null
        }
      >
        <div className="max-w-[900px] w-full mx-auto">
          <TicketInformation
            reportData={selectedPendingTicket}
            currentUser={currentUser}
          />
          <AssignTicketDrawer
            assigning={assigning && selectedPendingTicket}
            setAssigning={setAssigningHandler}
            selectedTicket={selectedPendingTicket}
          />
          <ReportTicketDrawer
            reporting={reporting}
            setReporting={setReportingHandler}
            selectedTicket={selectedPendingTicket}
          />
          <DeclineTicketDrawer
            declining={declining}
            setDeclining={setDeclining}
            selectedTicket={selectedPendingTicket}
          />
          <BlockingDrawer
            blocking={blocking}
            setBlocking={setBlockingHandler}
            selectedTicket={selectedPendingTicket}
          />
        </div>
      </Drawer>
    </>
  );
};

export default PendingDrawer;
