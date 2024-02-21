import { createSlice, current } from "@reduxjs/toolkit";
import { message } from "antd";
const initialState = {
  isLoading: false,
  activationLoading: false,
  updateLoading: false,
  addLoading: false,
  reportCategory: [],
  supervisorList: [],
  deptTypeList: [],
  departmentList: [],
  agentList: [],
  responseTeamsList: [],
  caseTypes: [],
  deviceList: [],
  contentWriters: [],
  commandCenters: [],
  mode: false,
  selectedAccount: null,
};

const ressourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    reset: () => initialState,
    updateRtPayment(state, { payload }) {
      state.responseTeamsList = [...current(state.responseTeamsList)].map(
        (rt) => {
          if (rt.accountId === payload.rtaccountId) {
            return {
              ...rt,
              latestPaymentLog: { ...rt.latestPaymentLog, ...payload },
            };
          }
          return { ...rt };
        }
      );
    },
    setCommandCenters(state, action) {
      state.commandCenters = action.payload;
    },
    setMode(state, action) {
      state.mode = action.payload;
    },
    setSelectedAccount(state, action) {
      state.selectedAccount = action.payload;
    },
    fetchResources(state) {
      state.isLoading = true;
    },
    updateResources(state) {
      state.isLoading = true;
    },
    setResources(state, action) {
      for (const key in action.payload) {
        state[key] = action.payload[key];
      }
      state.isLoading = false;
    },
    deactivateAccount(state) {
      state.activationLoading = true;
    },
    deactivateAccountSuccess(state, action) {
      message.success(action.payload?.message);
      if (action.payload?.listType === "deviceList") {
        state[action.payload?.listType] = current(
          state[action.payload?.listType]
        ).map((acc) => {
          if (acc.macAddress === action.payload?.accountId)
            return { ...acc, isDeleted: 1 };
          return acc;
        });
      } else {
        state[action.payload?.listType] = current(
          state[action.payload?.listType]
        ).map((acc) => {
          if (acc.accountId === action.payload?.accountId)
            return { ...acc, isDeleted: 1 };
          return acc;
        });
      }
      state.activationLoading = false;
    },
    reactivateAccount(state) {
      state.activationLoading = true;
    },
    reactivateAccountSuccess(state, action) {
      message.success(action.payload?.message);
      if (action.payload?.listType === "deviceList") {
        state[action.payload?.listType] = current(
          state[action.payload?.listType]
        ).map((acc) => {
          if (acc.macAddress === action.payload?.accountId)
            return { ...acc, isDeleted: 0 };
          return acc;
        });
      } else {
        state[action.payload?.listType] = current(
          state[action.payload?.listType]
        ).map((acc) => {
          if (acc.accountId === action.payload?.accountId)
            return { ...acc, isDeleted: 0 };
          return acc;
        });
      }
      state.activationLoading = false;
    },
    updateAccount(state) {
      state.updateLoading = true;
    },
    updateAccountSuccess(state, action) {
      message.success(action.payload?.message);

      if (action.payload?.listType === "deviceList") {
        state[action.payload?.listType] = current(
          state[action.payload?.listType]
        ).map((acc) => {
          if (acc.macAddress === action.payload?.accountId)
            return { ...acc, ...action.payload?.body };
          return acc;
        });
      } else {
        state[action.payload?.listType] = current(
          state[action.payload?.listType]
        ).map((acc) => {
          if (acc.accountId === action.payload?.accountId)
            return { ...acc, ...action.payload?.body };
          return acc;
        });
      }

      state.mode = false;
      state.selectedAccount = null;
      state.updateLoading = false;
    },
    addAccount(state) {
      state.addLoading = true;
    },
    addAccountSuccess(state, action) {
      message.success(action.payload?.message);
      state[action.payload?.listType] = [
        ...current(state[action.payload?.listType]),
        action.payload?.data,
      ];
      state.mode = false;
      state.selectedAccount = null;
      state.addLoading = false;
    },
    addCaseType(state) {
      state.addLoading = true;
    },
    addCaseTypeSuccess(state, action) {
      console.log(action);
      message.success(action.payload?.message);
      console.log(action.payload?.listType);
      state[action.payload?.listType] = [
        ...current(state[action.payload?.listType]),
        action.payload?.data,
      ];
      state.mode = false;
      state.selectedAccount = null;
      state.addLoading = false;
    },
    updateCaseType(state) {
      state.updateLoading = true;
    },
    updateCaseTypeSuccess(state, action) {
      message.success(action.payload?.message);

      state[action.payload?.listType] = current(
        state[action.payload?.listType]
      ).map((acc) => {
        if (acc.id === action.payload?.id)
          return { ...acc, ...action.payload?.body };
        return acc;
      });

      state.mode = false;
      state.selectedAccount = null;
      state.updateLoading = false;
    },
    deactivateCaseType(state) {
      state.isLoading = true;
    },
    deactivateCaseTypeSuccess(state, action) {
      message.success(action.payload?.message);

      const caseTypes = current(state[action.payload?.listType]).map((acc) => {
        if (acc.id === action.payload?.id) {
          return { ...acc, isDeleted: 1 };
        }
        return acc;
      });

      state[action.payload?.listType] = caseTypes;

      state.isLoading = false;
    },
    resetStates(state) {
      state.isLoading = false;
      state.activationLoading = false;
      state.updateLoading = false;
      state.addLoading = false;
      state.mode = false;
      state.selectedAccount = null;

      state.reportCategory = [];
      state.departmentList = [];
      state.agentList = [];
      state.supervisorList = [];
      state.contentWriters = [];
      state.caseTypes = [];
      state.responseTeamsList = [];
      state.deviceList = [];
      state.deptTypeList = [];
    },
    requestError(state, action) {
      message.warning(action.payload?.data?.message);
      state.isLoading = false;
      state.activationLoading = false;
      state.updateLoading = false;
      state.addLoading = false;
    },
  },
});

export default ressourcesSlice;
