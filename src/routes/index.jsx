import { lazy } from "react";
import {
  DashboardIcon,
  PhoneIcon,
  TicketOutlineIcon,
  UsersIcon,
  DocumentIcon,
  MapIcon,
  CCTVIcon,
  FormatCircleIcon,
  MobileIcon,
  WifiIcon,
  FolderIcon,
  SettingsIcon,
  KeyboardIcon,
  PenIcon,
} from "../assets/icons/Icons";
import AccountRoutes from "./AccountRoutes";
import NewsGen from "../components/Authenticated/Pages/News/NewsGen";

const OnboardingApplicationsPage = lazy(() =>
  import(
    "../components/Authenticated/Pages/OnboardingApplications/OnboardingApplicationsPage"
  )
);
const CommandCentersPage = lazy(() =>
  import("../components/Authenticated/Pages/CommandCenters/CommandCentersPage")
);
const DirectoriesPage = lazy(() =>
  import("../components/Authenticated/Pages/Directories/DirectoriesPage")
);
const SensorsPage = lazy(() =>
  import("../components/Authenticated/Pages/Sensors/SensorsPage")
);
const AppVersionsPage = lazy(() =>
  import("../components/Authenticated/Pages/AppVersions/AppVersionsPage")
);
const DashboardPage = lazy(() =>
  import("../components/Authenticated/Pages/Dashboard/DashboardPage")
);
const NewsPage = lazy(() =>
  import("../components/Authenticated/Pages/News/NewsPage")
);
const CitizensPage = lazy(() =>
  import("../components/Authenticated/Pages/Citizens/CitizensPage")
);
const EmergencyTicketsPage = lazy(() =>
  import(
    "../components/Authenticated/Pages/Emergency Tickets/EmergencyTicketsPage"
  )
);
const CallLogsPage = lazy(() =>
  import("../components/Authenticated/Pages/CallLogs/CallLogsPage")
);
const ReportEntryPage = lazy(() =>
  import("../components/Authenticated/Pages/ReportEntry/ReportEntryPage")
);
const ReportsPage = lazy(() =>
  import("../components/Authenticated/Pages/Reports/ReportsPage")
);
const MapPage = lazy(() =>
  import("../components/Authenticated/Pages/Map/MapPage")
);
const CCTVPage = lazy(() =>
  import("../components/Authenticated/Pages/CCTV/CCTVPage")
);
const AccountSettingsPage = lazy(() =>
  import(
    "../components/Authenticated/Pages/AccountSettings/AccountSettingsPage"
  )
);
const routes = {
  superadmin: [
    {
      path: "/commandcenters",
      element: <CommandCentersPage />,
      icon: FormatCircleIcon,
      name: "Command Centers",
      children: undefined,
    },
    {
      path: "/accounts",
      icon: UsersIcon,
      name: "Accounts",
      children: AccountRoutes["superadmin"],
    },
    {
      path: "/appVersions",
      element: <AppVersionsPage />,
      icon: MobileIcon,
      name: "App Versions",
      children: undefined,
    },
    {
      path: "/direcrories",
      element: <DirectoriesPage />,
      icon: FolderIcon,
      name: "Directories ",
      children: undefined,
    },
    {
      path: "/onboardingApplications",
      element: <OnboardingApplicationsPage />,
      icon: PenIcon,
      name: "Onboarding Applications ",
      children: undefined,
    },
  ],
  admin: [
    {
      path: "/dashboard",
      element: <DashboardPage />,
      icon: DashboardIcon,
      name: "Dashboard",
      children: undefined,
    },
    {
      path: "/map",
      element: <MapPage />,
      icon: MapIcon,
      name: "Map",
      children: undefined,
    },
    {
      path: "/reports",
      element: <ReportsPage />,
      icon: DocumentIcon,
      name: "Reports",
      children: undefined,
    },
    {
      path: "/cctv",
      element: <CCTVPage />,
      icon: CCTVIcon,
      name: "CCTV",
      children: undefined,
    },
    {
      path: "/accounts",
      icon: UsersIcon,
      name: "Accounts",
      children: AccountRoutes["admin"],
    },
    {
      path: "/citizens",
      element: <CitizensPage />,
      icon: UsersIcon,
      name: "Citizens",
      children: undefined,
    },
    {
      path: "/sensors",
      element: <SensorsPage />,
      icon: WifiIcon,
      name: "Sensors",
      children: undefined,
    },
    {
      path: "/direcrories",
      element: <DirectoriesPage />,
      icon: FolderIcon,
      name: "Directories ",
      children: undefined,
    },
    {
      path: "/accountSettings",
      element: <AccountSettingsPage />,
      icon: SettingsIcon,
      name: "Account Settings",
      children: undefined,
    },
  ],
  supervisor: [
    {
      path: "/dashboard",
      element: <DashboardPage />,
      icon: DashboardIcon,
      name: "Dashboard",
      children: undefined,
    },
    {
      path: "/map",
      element: <MapPage />,
      icon: MapIcon,
      name: "Map",
      children: undefined,
    },
    {
      path: "/reports",
      element: <ReportsPage />,
      icon: DocumentIcon,
      name: "Reports",
      children: undefined,
    },
    {
      path: "/emergencyTickets",
      element: <EmergencyTicketsPage />,
      icon: TicketOutlineIcon,
      name: "Emergency Tickets",
      children: undefined,
    },
    {
      path: "/accounts",
      icon: UsersIcon,
      name: "Accounts",
      children: AccountRoutes["supervisor"],
    },
  ],
  agent: [
    {
      path: "/dashboard",
      element: <DashboardPage />,
      icon: DashboardIcon,
      name: "Dashboard",
      children: undefined,
    },
    {
      path: "/emergencyTickets",
      element: <EmergencyTicketsPage />,
      icon: TicketOutlineIcon,
      name: "Emergency Tickets",
      children: undefined,
    },
    {
      path: "/reportEntry",
      element: <ReportEntryPage />,
      icon: KeyboardIcon,
      name: "Report Entry",
      children: undefined,
    },
    {
      path: "/map",
      element: <MapPage />,
      icon: MapIcon,
      name: "Map",
      children: undefined,
    },
    {
      path: "/reports",
      element: <ReportsPage />,
      icon: DocumentIcon,
      name: "Reports",
      children: undefined,
    },
    {
      path: "/callLogs",
      element: <CallLogsPage />,
      icon: PhoneIcon,
      name: "Call Logs",
      children: undefined,
    },
    {
      path: "/accounts",
      icon: UsersIcon,
      name: "Accounts",
      children: AccountRoutes["agent"],
    },
  ],
  department: [
    {
      path: "/dashboard",
      element: <DashboardPage />,
      icon: DashboardIcon,
      name: "Dashboard",
      children: undefined,
    },
    {
      path: "/reports",
      element: <ReportsPage />,
      icon: DocumentIcon,
      name: "Reports",
      children: undefined,
    },
    {
      path: "/emergencyTickets",
      element: <EmergencyTicketsPage />,
      icon: TicketOutlineIcon,
      name: "Emergency Tickets",
      children: undefined,
    },
    {
      path: "/accounts",
      icon: UsersIcon,
      name: "Accounts",
      children: AccountRoutes["department"],
    },
  ],
  contentwriter: [
    {
      path: "/news",
      icon: UsersIcon,
      name: "News",
      children: [
        {
          path: "/list",
          icon: UsersIcon,
          name: "Current News",
          children: undefined,
          element: <NewsPage />,
        },
        {
          path: "/add-news",
          icon: UsersIcon,
          name: "Add News",
          children: undefined,
          element: <NewsGen />,
        },
      ],
    },
    {
      path: "/reports",
      element: <EmergencyTicketsPage />,
      icon: TicketOutlineIcon,
      name: "Reports",
      children: undefined,
    },
  ],
};
export default routes;
