import {
	IconHome,
	IconCalendarEvent,
	IconDashboard,
	IconInnerShadowTop,
	IconSettings,
	IconUsers,
} from "@tabler/icons-react"

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRight } from "lucide-react"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Dashboard",
			url: "/",
			icon: IconDashboard,
		},
		{
			title: "Bookings",
			icon: IconCalendarEvent,
			children: [
				{ title: "View Bookings", url: "/bookings" },
				{ title: "Create Booking", url: "/bookings/create" },
			],
		},
		{
			title: "Venues",
			icon: IconHome,
			children: [
				{ title: "All Venues", url: "/venues" },
				{ title: "Add Venue", url: "/venues/add" },
			],
		},
		{
			title: "Users",
			icon: IconUsers,
			children: [
				{ title: "User List", url: "/users" },
				{ title: "Invite User", url: "/users/invite" },
			],
		},
		{
			title: "Settings",
			icon: IconSettings,
			children: [
				{ title: "Profile", url: "/settings/profile" },
				{ title: "Preferences", url: "/settings/preferences" },
			],
		},
	],
}

export function AppSidebar({ ...props }) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<a href="#">
								<IconInnerShadowTop className="!size-5" />
								<span className="text-base font-semibold">Ayretium</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menu</SidebarGroupLabel>
					<SidebarMenu>
						{data.navMain.map((item) => {
							const hasChildren = item.children && item.children.length > 0
							return hasChildren ? (
								<Collapsible
									key={item.title}
									asChild
									defaultOpen={item.isActive}
									className="group/collapsible"
								>
									<SidebarMenuItem>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton tooltip={item.title}>
												{item.icon && <item.icon />}
												<span>{item.title}</span>
												<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.children.map((subItem) => (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton asChild>
															<a href={subItem.url}>
																<span>{subItem.title}</span>
															</a>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							) : (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild tooltip={item.title}>
										<a href={item.url}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							)
						})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>

			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	)
}
