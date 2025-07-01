// lib/navigation.js
import {
  IconDashboard,
  IconCalendarEvent,
  IconUsers,
  IconBuildings,
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
        path: "/dashboard/test/current",
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
    label: "Venues",
    icon: IconBuildings,
    title: "Venues",
    children: [
      {
        label: "All Venues",
        path: "/dashboard/venue",
        title: "All Venues",
      },
	  {
        label: "Live Venues",
        path: "/dashboard/venue/live",
        title: "Live Venues",
      },
      {
        label: "New Venue",
        path: "/dashboard/venue/new",
        title: "Create Venue",
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
