import {
  Agents,
  CaseTypes,
  ResponseTeams,
  Devices,
  Supervisors,
  Admins,
  ContentWriters,
  Departments,
  RTSubscriptionPlans,
  RTSubscriptions,
  DeptBatchSubscription,
} from "../components/Authenticated/Pages/Accounts/Index";
import DownloadResponderApp from "../components/UI/Button/DownloadResponderApp";
import DeptRoutes from "./DeptRoutes";

const AccountRoutes = {
  superadmin: [
    {
      path: "/admins",
      element: <Admins />,
      name: "Admins",
    },
    {
      path: "/dispatchers",
      element: <Agents />,
      name: "Dispatchers",
    },
    {
      path: "/departments",
      element: <Departments />,
      name: "Departments",
      children: undefined,
    },
    {
      path: "/responseTeams",
      // element: <ResponseTeams />,
      name: "Response Teams",
      children: [
        {
          path: "/responders",
          element: <ResponseTeams />,
          name: "Responders",
        },
        {
          path: "/subscriptions",
          element: <RTSubscriptions />,
          name: "Subscriptions",
        },
        {
          path: "/subscriptionPlans",
          element: <RTSubscriptionPlans />,
          name: "Subscription Plans",
        },
      ],
    },
    {
      path: "/contentWriters",
      element: <ContentWriters />,
      name: "Content Writers",
    },
  ],
  admin: [
    {
      path: "/supervisors",
      element: <Supervisors />,
      name: "Supervisors",
    },
    {
      path: "/dispatchers",
      element: <Agents />,
      name: "Dispatchers",
    },
    {
      path: "/departments",
      name: "Departments",
      children: DeptRoutes["admin"],
    },
    {
      path: "/responseTeams",
      element: <ResponseTeams />,
      name: "Response Teams",
    },
    {
      path: "/contentWriters",
      element: <ContentWriters />,
      name: "Content Writers",
    },
    {
      path: "/casetypes",
      element: <CaseTypes />,
      name: "Case Types",
    },
    {
      path: "/devices",
      element: <Devices />,
      name: "Devices",
    },
  ],
  agent: [
    {
      path: "/responseTeams",
      element: <ResponseTeams />,
      name: "Response Teams",
    },
  ],
  supervisor: [
    {
      path: "/dispatchers",
      element: <Agents />,
      name: "Dispatchers",
    },
    {
      path: "/responders",
      element: <ResponseTeams />,
      name: "Response Teams",
    },
  ],
  department: [
    {
      path: "/responseTeams",
      name: "Response Teams",
      children: [
        {
          path: "/responders",
          element: <ResponseTeams />,
          name: "Responders",
        },
        {
          path: "/subscriptions",
          element: <DeptBatchSubscription />,
          name: "Subscriptions",
        },
      ],
    },
    {
      type: "button",
      element: <DownloadResponderApp />,
      name: "Download Responder App",
    },
  ],
};
export default AccountRoutes;
