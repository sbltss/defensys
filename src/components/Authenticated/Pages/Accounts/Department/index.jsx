import { lazy } from "react";

const DepartmentList = lazy(() => import("./DepartmentList/Departments"));
const Barangays = lazy(() => import("./Barangays/Barangays"));
const VolunteerGroups = lazy(() => import("./VolunteerGroups/VolunteerGroups"));
const DepartmentTypes = lazy(() =>
  import("./DepartmentTypes/DepartmentTypesPage")
);

export { DepartmentList, Barangays, VolunteerGroups, DepartmentTypes };
