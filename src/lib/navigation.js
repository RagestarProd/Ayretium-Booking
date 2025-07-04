// lib/navigation.js
import {
	IconDashboard,
	IconCalendarEvent,
	IconUsers,
	IconBuildings,
	IconBuildingStore,
	IconDoor
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
		path: "/dashboard/booking",
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
		label: "Organisations",
		icon: IconBuildings,
		title: "Organisations",
		path: "/dashboard/venue/group",
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
		path: "/dashboard/venue",
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
		label: "Rooms",
		icon: IconDoor,
		title: "Rooms",
		path: "/dashboard/venue/room",
		children: [
			{
				label: "All Rooms",
				path: "/dashboard/venue/room",
				title: "All Rooms",
			},
			{
				label: "New Room",
				path: "/dashboard/venue/room/new",
				title: "New Rooms",
			}
		],
	},
	{
		label: "Users",
		path: "/dashboard/users",
		icon: IconUsers,
		title: "Users",
		children: [
			{
				label: "All Users",
				path: "/dashboard/users",
				title: "All Users",
			},
			{
				label: "New User",
				path: "/dashboard/users/new",
				title: "New User",
			}
		],
	},
];
