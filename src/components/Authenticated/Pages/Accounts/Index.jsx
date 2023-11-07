import { lazy } from "react";

const Agents = lazy(() => import("./Agent/Agents"));
const CaseTypes = lazy(() => import("./CaseTypes"));
const ResponseTeams = lazy(() => import("./ResponseTeam/ResponseTeams"));
const Devices = lazy(() => import("./Device/Devices"));
const Supervisors = lazy(() => import("./Supervisor/Supervisors"));
const Admins = lazy(() => import("./Admin/Admins"));
const ContentWriters = lazy(() => import("./ContentWriter/ContentWriters"));
const Departments = lazy(() =>
  import("./Department/DepartmentList/Departments")
);
const RTSubscriptionPlans = lazy(() =>
  import("./RTSubscriptionPlans/RTSubscriptionPlansPage")
);
const RTSubscriptions = lazy(() =>
  import("./RTSubscriptions/RTSubscriptionsPage")
);
const DeptBatchSubscription = lazy(() =>
  import("./DeptBatchSubscription/DeptBatchSubscriptionPage")
);

export {
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
};
