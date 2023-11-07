import { createSlice, current } from "@reduxjs/toolkit";
import { message } from "antd";
const initialState = {
  selectedTab: "pending",

  fetchPendingTicketLoading: false,
  pendingTickets: [],
  selectedPendingTicket: null,

  fetchAcceptedTicketLoading: false,
  acceptedTickets: [],
  selectedAcceptedTicket: null,

  assignedDepartments: [],
  fetchAssignedDepartmentsLoading: false,

  assignedResponseTeams: [],
  fetchAssignedResponseTeamsLoading: false,

  fetchReportedTicketLoading: false,
  reportedTickets: [],
  selectedReportedTicket: null,

  fetchDeclinedTicketLoading: false,
  declinedTickets: [],
  selectedDeclinedTicket: null,

  fetchReportsOfTheDayLoading: false,
  reportsOfTheDay: [],
  selectedReportsOfTheDay: null,

  fetchArchivedReportsOfTheDayLoading: false,
  archivedReportsOfTheDay: [],
  selectedArchivedReportsOfTheDay: null,

  fetchSupervisorTicketsLoading: false,
  supervisorTickets: [],
  selectedSupervisorTickets: null,

  fetchTransferredTicketLoading: false,
  transferredTickets: [],
  selectedTransferredTicket: null,

  readTicketLoading: false,

  assigning: false,
  assignToDepartmentLoading: false,
  assignToResponseTeamLoading: false,

  reporting: false,
  reportTicketLoading: false,

  blocking: false,
  blockCitizenLoading: false,

  ticketNotifs: [],
  fetchTicketNotifsLoading: false,

  chatNotifs: [],
  fetchChatNotifsLoading: false,

  acceptTicketLoading: false,

  resolveTicketLoading: false,

  declineTicketLoading: false,

  offlineReports: [],
  fetchOfflineLoading: false,
  selectedOfflineReport: null,
};
const emergencyTicketsSlice = createSlice({
  name: "emergencyTickets",
  initialState,
  reducers: {
    reset: () => initialState,

    addToResponseTeams(state, { payload }) {
      const newList = [];
      newList.push(...payload);
      const list = [...payload].map((l) => l.accountId);
      const oldList = [...state.assignedResponseTeams];

      oldList.forEach((l) => {
        if (!list.includes(l.accountId)) newList.push(l);
      });

      state.assignedResponseTeams = newList;
    },
    acceptTicket(state) {
      state.acceptTicketLoading = true;
    },
    acceptTicketSuccess(state, { payload }) {
      state.pendingTickets = current(state.pendingTickets).filter(
        (t) => t.transactionNumber !== payload.data.transactionNumber
      );
      state.acceptedTickets = [payload.data, ...current(state.acceptedTickets)];
      state.acceptTicketLoading = false;
      state.selectedTab = "accepted";
      state.selectedPendingTicket = null;
      state.selectedAcceptedTicket = payload.data;
      message.success(payload.message);
    },
    resolveTicket(state) {
      state.resolveTicketLoading = true;
    },
    resolveTicketSuccess(state, { payload }) {
      state.acceptedTickets = current(state.acceptedTickets).map((ticket) => {
        if (ticket.transactionNumber === payload.data.transactionNumber)
          return { ...ticket, ...payload.data };
        else return ticket;
      });
      state.resolveTicketLoading = false;
      state.selectedAcceptedTicket = {
        ...current(state.selectedAcceptedTicket),
        ...payload.data,
      };
      message.success(payload.message);
    },
    declineTicket(state) {
      state.declineTicketLoading = true;
    },
    declineTicketSuccess(state, { payload }) {
      state.pendingTickets = current(state.pendingTickets).filter(
        (t) => t.transactionNumber !== payload.data.transactionNumber
      );
      state.declinedTickets = [payload.data, ...current(state.declinedTickets)];
      state.declineTicketLoading = false;
      state.selectedTab = "declined";
      state.selectedPendingTicket = null;
      message.success(payload.message);
    },
    setSelectedTab(state, { payload }) {
      state.selectedTab = payload;
    },
    ticketAssigned(state, action) {
      if (
        current(state.selectedPendingTicket)?.transactionNumber ===
        action.payload.transactionNumber
      ) {
        state.assigning = false;
        state.reporting = false;
      }
      if (action.payload.allocatedTo === action.payload.userId) {
        state.acceptedTickets = [
          action.payload,
          ...current(state.acceptedTickets),
        ];
      }
      state.pendingTickets = current(state.pendingTickets).filter(
        (t) => t.transactionNumber !== action.payload.transactionNumber
      );
    },
    ticketReported(state, action) {
      if (
        current(state.selectedPendingTicket)?.transactionNumber ===
        action.payload.transactionNumber
      ) {
        state.selectedPendingTicket = null;
        state.assigning = false;
        state.assignToDepartmentLoading = false;
        state.reporting = false;
      }
      state.reportedTickets = [
        action.payload,
        ...current(state.reportedTickets),
      ];
      state.pendingTickets = current(state.pendingTickets).filter(
        (t) => t.transactionNumber !== action.payload.transactionNumber
      );
    },
    setAssigning(state, action) {
      state.assigning = action.payload;
    },
    setReporting(state, action) {
      state.reporting = action.payload;
    },
    setBlocking(state, action) {
      state.blocking = action.payload;
    },
    readTicket() {},
    unreadTicket() {},
    assignToDepartment(state) {
      state.assignToDepartmentLoading = true;
    },
    assignToDepartmentSuccess(state, { payload }) {
      message.success(payload.message);
      if (payload.info) message.info(payload.info, 5);
      state.assigning = false;
      state.assignToDepartmentLoading = false;
      if (payload.data) {
        state.selectedPendingTicket = null;
        state.pendingTickets = state.pendingTickets.filter(
          (ticket) =>
            ticket.transactionNumber !== payload.data.transactionNumber
        );
        state.acceptedTickets = [payload.data, ...state.acceptedTickets];
        state.selectedAcceptedTicket = payload.data;
        state.selectedTab = "accepted";
      }
    },
    assignToResponseTeam(state) {
      state.assignToResponseTeamLoading = true;
    },
    assignToResponseTeamSuccess(state, { payload }) {
      message.success(payload.message);
      state.assignToResponseTeamLoading = false;
      state.assigning = false;
      state.assignedResponseTeams = [
        payload.data,
        ...state.assignedResponseTeams,
      ];
    },
    fetchPendingTickets(state, action) {
      state.fetchPendingTicketLoading = true;
    },
    fetchPendingTicketsSuccess(state, action) {
      state.fetchPendingTicketLoading = false;
      state.pendingTickets = action.payload;
    },
    fetchAcceptedTickets(state, action) {
      state.fetchAcceptedTicketLoading = true;
    },
    fetchAcceptedTicketsSuccess(state, action) {
      state.fetchAcceptedTicketLoading = false;
      state.acceptedTickets = action.payload;
      if (state.selectedAcceptedTicket) {
        state.selectedAcceptedTicket =
          action.payload.filter(
            (ticket) =>
              ticket.transactionNumber ===
              state.selectedAcceptedTicket.transactionNumber
          )?.[0] || null;
      }
    },
    fetchDeclinedTickets(state, action) {
      state.fetchDeclinedTicketLoading = true;
    },
    fetchDeclinedTicketsSuccess(state, action) {
      state.fetchDeclinedTicketLoading = false;
      state.declinedTickets = action.payload;
    },
    selectDeclinedTicket(state, { payload }) {
      state.selectedDeclinedTicket = payload;
    },
    fetchReportedTickets(state, action) {
      state.fetchReportedTicketLoading = true;
    },
    fetchReportedTicketsSuccess(state, action) {
      state.fetchReportedTicketLoading = false;
      state.reportedTickets = action.payload;
    },
    selectReportedTicket(state, { payload }) {
      state.selectedReportedTicket = payload;
    },
    fetchReportsOfTheDay(state) {
      state.fetchReportsOfTheDayLoading = true;
    },
    fetchReportsOfTheDaySuccess(state, action) {
      state.fetchReportsOfTheDayLoading = false;
      state.reportsOfTheDay = action.payload;
    },
    fetchArchivedReportsOfTheDay(state) {
      state.fetchArchivedReportsOfTheDayLoading = true;
    },
    fetchArchivedReportsOfTheDaySuccess(state, action) {
      state.fetchArchivedReportsOfTheDayLoading = false;
      state.archivedReportsOfTheDay = action.payload;
    },
    fetchSupervisorTickets(state) {
      state.fetchSupervisorTicketsLoading = true;
    },
    fetchSupervisorTicketsSuccess(state, action) {
      state.fetchSupervisorTicketsLoading = false;
      state.supervisorTickets = action.payload;
    },
    fetchTransferredTickets(state, action) {
      state.fetchTransferredTicketLoading = true;
    },
    fetchTransferredTicketsSuccess(state, action) {
      state.fetchTransferredTicketLoading = false;
      state.transferredTickets = action.payload;
    },
    selectPendingTicket(state, action) {
      state.selectedPendingTicket = action.payload;
      if (action.payload)
        if (
          state.pendingTickets.filter(
            (t) => t.transactionNumber === action.payload.transactionNumber
          ).length === 0
        ) {
          state.pendingTickets = [
            ...state.pendingTickets,
            action.payload,
            ...state.pendingTickets,
          ];
        }
    },
    reportTicket(state) {
      state.reportTicketLoading = true;
    },
    reportTicketSuccess(state, action) {
      message.success(action.payload.message);
      if (action.payload.data) {
        state.acceptedTickets = [action.payload.data, ...state.acceptedTickets];
        state.pendingTickets = (state.pendingTickets || []).filter(
          (t) => t.transactionNumber != action.payload.data.transactionNumber
        );
      }
      state.reportTicketLoading = false;
      state.selectedPendingTicket = null;
    },
    blockCitizen(state) {
      state.blockCitizenLoading = true;
    },
    blockCitizenSuccess(state, action) {
      message.success(action.payload.message);
      state.blockCitizenLoading = false;
      state.blocking = false;
    },
    updatePendingTickets(state, action) {
      let checkExist = current(state.pendingTickets).filter(
        (t) => t.transactionNumber === action.payload.transactionNumber
      );
      if (checkExist.length > 0) {
        state.pendingTickets = current(state.pendingTickets).map((t) => {
          if (t.transactionNumber !== action.payload.transactionNumber) {
            return t;
          }
          return { ...t, ...action.payload };
        });
      } else {
        state.pendingTickets = [
          action.payload,
          ...current(state.pendingTickets),
        ];
      }
    },

    updateOfflineReports(state, action) {
      let checkExist = current(state.offlineReports).filter(
        (t) => t.id === action.payload.id
      );
      if (checkExist.length > 0) {
        state.offlineReports = current(state.offlineReports).map((t) => {
          if (t.id !== action.payload.id) {
            return t;
          }
          return { ...t, ...action.payload };
        });
      } else {
        state.offlineReports = [
          action.payload,
          ...current(state.offlineReports),
        ];
      }
    },
    removePendingTicket(state, { payload }) {
      state.pendingTickets = state.pendingTickets.filter(
        (ticket) => ticket.transactionNumber !== payload
      );
    },
    updateAcceptedTickets(state, action) {
      let checkExist = current(state.acceptedTickets).filter(
        (t) => t.transactionNumber === action.payload.transactionNumber
      );
      if (checkExist.length > 0) {
        state.acceptedTickets = current(state.acceptedTickets).map((t) => {
          if (t.transactionNumber !== action.payload.transactionNumber) {
            return t;
          }
          return { ...t, ...action.payload };
        });
      } else {
        state.acceptedTickets = [
          action.payload,
          ...current(state.acceptedTickets),
        ];
      }
    },

    selectAcceptedTicket(state, action) {
      if (!action.payload) {
        state.assignedDepartments = [];
        state.assignedResponseTeams = [];
        state.selectedAcceptedTicket = action.payload;
      } else if (Object.keys(action.payload).length === 1) {
        state.selectedAcceptedTicket = current(state.acceptedTickets).filter(
          (ticket) =>
            ticket.transactionNumber === action.payload.transactionNumber
        )[0];

        state.selectedTab = "accepted";
      } else {
        state.selectedAcceptedTicket = action.payload;
      }
    },
    selectOngoingTicket(state, action) {
      state.selectedSupervisorTickets = action.payload;
    },

    updateSupervisorTickets(state, action) {
      let checkExist = current(state.supervisorTickets).filter(
        (t) => t.hazardId === action.payload.hazardId
      );
      if (checkExist.length > 0) {
        state.supervisorTickets = current(state.supervisorTickets).map((t) => {
          if (t.hazardId !== action.payload.hazardId) {
            return t;
          }
          return { ...t, ...action.payload };
        });
      } else {
        state.supervisorTickets = [
          action.payload,
          ...current(state.supervisorTickets),
        ];
      }
    },

    updateReportsOfTheDay(state, action) {
      let checkExist = current(state.reportsOfTheDay).filter(
        (t) => t.hazardId === action.payload.hazardId
      );

      if (checkExist.length > 0) {
        const newArchivedReportsOfTheDay = [
          ...state.archivedReportsOfTheDay,
          { ...checkExist[0], ...action.payload },
        ];
        state.archivedReportsOfTheDay = newArchivedReportsOfTheDay;

        state.reportsOfTheDay = current(state.reportsOfTheDay).map((t) => {
          if (t.hazardId !== action.payload.hazardId) {
            return t;
          }
          return { ...t, ...action.payload };
        });
      } else {
        state.reportsOfTheDay = [...state.reportsOfTheDay, action.payload];
      }

      const newSupervisorTickets = [...state.supervisorTickets].map((t) => {
        if (t.transactionNumber == action.payload.transactionNumber)
          return { ...t, isReported: 1 };
        else return t;
      });

      state.supervisorTickets = newSupervisorTickets;
    },

    updateArchivedReportsOfTheDay(state, action) {
      let checkExist = current(state.archivedReportsOfTheDay).filter(
        (t) => t.hazardId === action.payload.hazardId
      );
      if (checkExist.length > 0) {
        const newReportsOfTheDay = [
          ...state.reportsOfTheDay,
          { ...checkExist[0], ...action.payload },
        ];
        state.reportsOfTheDay = newReportsOfTheDay;

        state.archivedReportsOfTheDay = current(
          state.archivedReportsOfTheDay
        ).filter((t) => t.hazardId !== action.payload.hazardId);
      } else {
        state.archivedReportsOfTheDay = [
          ...state.archivedReportsOfTheDay,
          action.payload,
        ];
      }
    },

    setAssignedDepartments(state, action) {
      state.assignedDepartments = action.payload;
    },

    fetchAssignedDepartments(state) {
      state.fetchAssignedDepartmentsLoading = true;
    },
    fetchAssignedDepartmentsSuccess(state, { payload }) {
      state.assignedDepartments = payload;
      state.fetchAssignedDepartmentsLoading = false;
    },

    fetchAssignedResponseTeams(state) {
      state.fetchAssignedResponseTeamsLoading = true;
    },
    fetchAssignedResponseTeamsSuccess(state, { payload }) {
      state.assignedResponseTeams = payload;
      state.fetchAssignedResponseTeamsLoading = false;
    },

    setAssignedResponseTeams(state, action) {
      if (action.payload.accountType === "department") {
        state.assignedResponseTeams = action.payload.responseTeams;
      } else {
        state.assignedDepartments = state.assignedDepartments.map((d) => {
          if (action.payload.departmentId !== d.allocatedTo) return d;
          return {
            ...d,
            assignedResponseTeams: action.payload.responseTeams,
          };
        });
      }
    },

    fetchTicketNotifs(state) {
      state.fetchTicketNotifsLoading = true;
    },
    fetchTicketNotifsSuccess(state, { payload }) {
      state.ticketNotifs = payload;
      state.fetchTicketNotifsLoading = false;
    },

    fetchChatNotifs(state) {
      state.fetchChatNotifsLoading = true;
    },
    fetchChatNotifsSuccess(state, { payload }) {
      state.chatNotifs = payload;
      state.fetchChatNotifsLoading = false;
    },
    selectTransferredTicket(state, { payload }) {
      state.selectedTransferredTicket = payload;
    },

    fetchOfflineReports(state, action) {
      state.fetchOfflineReportsLoading = true;
    },
    fetchOfflineReportsSuccess(state, action) {
      state.fetchOfflineReportsLoading = false;
      state.offlineReports = action.payload;
    },
    selectOfflineReport(state, { payload }) {
      state.selectedOfflineReport = payload;
    },
    requestError(state, action) {
      message.warning(action.payload?.data?.message || "Request error");
      state.fetchPendingTicketLoading = false;
      state.fetchAcceptedTicketLoading = false;
      state.fetchReportedTicketLoading = false;
      state.fetchDeclinedTicketLoading = false;
      state.fetchTransferredTicketLoading = false;
      state.readTicketLoading = false;
      state.blockCitizenLoading = false;
      state.reporting = false;
      state.fetchTicketNotifsLoading = false;
      state.fetchChatNotifsLoading = false;
      state.acceptTicketLoading = false;
      state.declineTicketLoading = false;
      state.fetchAssignedResponseTeamsLoading = false;
      state.assignToDepartmentLoading = false;
      state.fetchArchivedReportsOfTheDayLoading = false;
    },
  },
});

export default emergencyTicketsSlice;
