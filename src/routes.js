import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Patients = React.lazy(() => import("./views/pages/Patients/Patients"));
const Exercises = React.lazy(() => import("./views/pages/Exercises/Exercise"));
const Clinic = React.lazy(() => import("./views/pages/Clinic/Clinic"));
const Session = React.lazy(() => import("./views/pages/Patients/Session"));
const UserProfile = React.lazy(
  () => import("./views/pages/UserProfile/UserProfile")
);
const Devices = React.lazy(() => import("./views/pages/Devices/Devices"));
const routes = [
  { path: "/home", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
  { path: "/user-profile", name: "My Account", element: UserProfile },
  { path: "/Patients/Patients-List", name: "Patients List", element: Patients },
  { path: "/Patients/Session", name: "Session", element: Session },
  {
    path: "/Exercises/Exercises-List",
    name: "Exercises List",
    element: Exercises,
  },
  { path: "/Clinic/Clinic-List", name: "Clinic", element: Clinic },
  { path: "/Devices/Devices-List", name: "Devices", element: Devices },
];

export default routes;
