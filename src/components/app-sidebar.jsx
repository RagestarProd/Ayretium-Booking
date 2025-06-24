import {
	IconHome,
	IconCalendarEvent,
	IconDashboard,
	IconSettings,
	IconUsers,
	IconUser,
	IconLogout,
} from "@tabler/icons-react"
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { ChevronRight, SettingsIcon } from "lucide-react"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { usePathname } from "next/navigation"

const data = {
	user: {
		name: "Tom",
		email: "m@example.com",
		avatar: "/avatars/admin.jpg",
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
				{ title: "View Bookings", url: "/?view" },
				{ title: "Create Booking", url: "/?create" },
			],
		},
		{
			title: "Venues",
			icon: IconHome,
			children: [
				{ title: "All Venues", url: "/?view2" },
				{ title: "Add Venue", url: "/?view3" },
			],
		},
		{
			title: "Users",
			icon: IconUsers,
			children: [
				{ title: "User List", url: "/?view5" },
				{ title: "Invite User", url: "/?view6" },
			],
		},
	],
}

export function AppSidebar({ ...props }) {
	const pathname = usePathname()
	return (
		<Sidebar collapsible="icon" className="group" {...props}>
			<SidebarHeader>
				<SidebarGroup className="gap-1 group-data-[collapsible=icon]:p-0">
					<a href="#">
						<img src="/logo.png" alt="Logo" />
					</a>
					<h1 className="group-data-[collapsible=icon]:hidden text-sidebar-foreground/70 text-xs">Booking System</h1>
					<span className="text-[9px] font-bold group-data-[collapsible=icon]:hidden text-sidebar-foreground/70">v0.0.1 BETA</span>
				</SidebarGroup>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menu</SidebarGroupLabel>
					<SidebarMenu>
						{data.navMain.map((item) => {
							const hasChildren = item.children && item.children.length > 0
							const isActive = item.url === pathname // exact match

							// Check if any subitem matches the current path
							const isGroupActive =
								hasChildren &&
								item.children.some((sub) => pathname.startsWith(sub.url))

							return hasChildren ? (
								<Collapsible
									key={item.title}
									asChild
									defaultOpen={isGroupActive}
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
												{item.children.map((subItem) => {
													const isActive = pathname === subItem.url
													return (
														<SidebarMenuSubItem key={subItem.title}>
															<SidebarMenuSubButton
																asChild
																className={
																	isActive
																		? "bg-muted text-primary font-semibold"
																		: ""
																}
															>
																<a href={subItem.url}>
																	<span>{subItem.title}</span>
																</a>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													)
												})}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							) : (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild tooltip={item.title} className={isActive ? "bg-muted text-primary font-semibold" : ""}>
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
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<div className="flex items-center gap-3 cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1.5 transition group/settings">
							<Avatar className="h-8 w-8">
								<AvatarImage src={data.user.avatar} alt={data.user.name} />
								<AvatarFallback>{data.user.name[0]}</AvatarFallback>
							</Avatar>
							<div className="flex flex-col text-left leading-tight">
								<span className="text-sm font-medium">{data.user.name}</span>
								<span className="text-xs text-muted-foreground">Admin</span>
							</div>
							<div className="flex flex-col ml-auto">
								<SettingsIcon className="group-hover/settings:block opacity-0 group-hover/settings:opacity-100 transition-opacity duration-200" />
							</div>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuItem asChild>
							<a href="/profile"><IconUser></IconUser>My Profile</a>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<a href="/settings"><IconSettings></IconSettings>Settings</a>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<a href="/logout"><IconLogout></IconLogout>Logout</a>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	)
}
