// lib/navigation.js
import {
  IconDashboard,
  IconCalendarEvent,
  IconUsers,
} from "@tabler/icons-react";

export const sidebarLinks = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: IconDashboard,
    title: "Dashboard",
  },
  {
    label: "Bookings",
    icon: IconCalendarEvent,
    title: "Bookings",
    children: [
      {
        label: "All Bookings",
        path: "/dashboard/booking",
        title: "All Bookings",
      },
      {
        label: "New Booking",
        path: "/dashboard/booking/new",
        title: "Create Booking",
      },
    ],
  },
  {
    label: "Users",
    path: "/settings",
    icon: IconUsers,
    title: "User Settings",
  },
];
