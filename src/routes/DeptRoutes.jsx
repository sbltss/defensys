import {
  Barangays,
  DepartmentList,
  VolunteerGroups,
  DepartmentTypes,
} from "../components/Authenticated/Pages/Accounts/Department/index";

const DeptRoutes = {
  admin: [
    {
      path: "/departmentList",
      element: <DepartmentList />,
      name: "Department List",
      children: undefined,
    },
    {
      path: "/departmentTypes",
      element: <DepartmentTypes />,
      name: "Department Types",
      children: undefined,
    },
    {
      path: "/barangays",
      element: <Barangays />,
      name: "Barangays",
      children: undefined,
    },
    {
      path: "/volunteerGroups",
      element: <VolunteerGroups />,
      name: "Volunteer Groups",
      children: undefined,
    },
  ],
};
export default DeptRoutes;
