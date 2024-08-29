import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilPuzzle,
  cilSitemap,
  cilSpeedometer,
  cilUserFollow,
  cilWeightlifitng,
  cilTouchApp,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: "My Account",
  //   to: "/user-profile",
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  // },

  {
    component: CNavTitle,
    name: "Details",
  },
  {
    component: CNavGroup,
    name: "Patients",
    to: "/Patients",
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Patients List",
        to: "/Patients/Patients-List",
      },
      {
        component: CNavItem,
        name: "Session",
        to: "/Patients/Session",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Exercises",
    to: "/Exercises",
    icon: <CIcon icon={cilWeightlifitng} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Exercises List",
        to: "/Exercises/Exercises-List",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Clinic",
    to: "/Clinic",
    icon: <CIcon icon={cilSitemap} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Clinic List",
        to: "/Clinic/Clinic-List",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Devices",
    to: "/Devices",
    icon: <CIcon icon={cilTouchApp} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Devices List",
        to: "/Devices/Devices-List",
      },
    ],
  },
];

export default _nav;
