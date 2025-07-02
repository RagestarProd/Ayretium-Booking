// lib/navigation.js
import {
	IconDashboard,
	IconCalendarEvent,
	IconUsers,
	IconBuildings,
	IconBuildingStore
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
		label: "Organisations",
		icon: IconBuildings,
		title: "Organisations",
		children: [
			{
				label: "All Organisations",
				path: "/dashboard/venue/group",
				title: "All Organisations",
			},
			{
				label: "New Organisation",
				path: "/dashboard/venue/group/new",
				title: "New Organisation",
			}
		],
	},
	{
		label: "Venues",
		icon: IconBuildingStore,
		title: "Venues",
		children: [
			{
				label: "All Venues",
				path: "/dashboard/venue",
				title: "All Venues",
			},
			{
				label: "New Venue",
				path: "/dashboard/venue/new",
				title: "New Venue",
			},
			{
				label: "Import Venues",
				path: "/dashboard/venue/import",
				title: "Import Venues",
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
