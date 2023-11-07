import { Wrapper } from "@googlemaps/react-wrapper";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import routes from "../../routes";
import {
  authActions,
  resourcesActions,
  ticketsActions,
} from "../../store/store";
import SocketWrapper from "../../websocket/SocketWrapper";
import MainLayout from "../UI/Layout/MainLayout";
import Call from "./Call/Call";
import Chat from "./Chat/Chat";
import ChangePass from "./Modal/ChangePass";

const {
  fetchPendingTickets,
  fetchReportsOfTheDay,
  fetchSupervisorTickets,
  fetchReportedTickets,
  fetchAcceptedTickets,
  fetchOfflineReports,
  fetchDeclinedTickets,
  fetchArchivedReportsOfTheDay,
} = ticketsActions;
const { setSocket, updateCurrentUser } = authActions;
const { fetchResources } = resourcesActions;

const Authenticated = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const resources = useSelector((state) => state.resources);
  const dispatch = useDispatch();
  const { selectedChatTicket } = useSelector((state) => state.chat);

  // useEffect(() => {
  //   dispatch(fetchResources({ toFetch: ["caseTypes"], existing: resources }));
  // }, []);
  useEffect(() => {
    const socket = io(import.meta.env.VITE_BASE_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", (e) => {
      console.log("connected");
      socket.emit("join_room", {
        role: currentUser.accountType,
        accountId: currentUser.accountId,
      });
      dispatch(setSocket(socket));
    });

    socket.on("disconnect", (e) => {
      console.log("disconnected");
      dispatch(setSocket(null));
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      dispatch(setSocket(null));
      socket.disconnect();
    };
  }, [currentUser.accountId, currentUser.accountType, dispatch]);

  useEffect(() => {
    if (currentUser.accountType === "contentwriter") {
      dispatch(fetchReportsOfTheDay());
      dispatch(fetchArchivedReportsOfTheDay());
      dispatch(fetchSupervisorTickets());
    }
    if (currentUser.accountType === "supervisor") {
      dispatch(fetchPendingTickets());
      dispatch(fetchReportsOfTheDay());
      dispatch(fetchArchivedReportsOfTheDay());
      dispatch(fetchSupervisorTickets());
      dispatch(fetchReportedTickets());
    }
    if (
      currentUser.accountType === "agent" ||
      currentUser.accountType === "department"
    ) {
      dispatch(fetchPendingTickets());
      dispatch(fetchAcceptedTickets());
    }

    if (currentUser.accountType === "agent") {
      dispatch(fetchReportsOfTheDay());
      dispatch(fetchReportedTickets());
    }
    if (currentUser.accountType === "department") {
      dispatch(fetchReportsOfTheDay());
      dispatch(fetchOfflineReports());
      dispatch(fetchDeclinedTickets());
    }
  }, [dispatch, currentUser.accountType]);

  useEffect(() => {
    const toFetch = [
      "reportCategory",
      "departmentList",
      "caseTypes",
      "agentList",
    ];

    dispatch(
      fetchResources({
        existing: resources,
        toFetch,
      })
    );

    dispatch(updateCurrentUser());
  }, []);

  return (
    <SocketWrapper>
      <Wrapper
        libraries={["geometry", "places", "visualization"]}
        apiKey={import.meta.env.VITE_GOOGLE_API}
      >
        <ChangePass />
        <MainLayout routes={routes?.[currentUser.accountType] || []} />
        {selectedChatTicket && <Chat />}
        {["agent", "department"].includes(currentUser?.accountType) && <Call />}
      </Wrapper>
    </SocketWrapper>
  );
};

export default Authenticated;
