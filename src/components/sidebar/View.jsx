'use client'

import Link from "next/link"
import {
	IconSettings,
	IconUser,
	IconLogout,
	IconSquareChevronRight
} from "@tabler/icons-react"
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
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
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { sidebarLinks } from "@/lib/navigation"
import { signOut } from "next-auth/react"
import { useSession } from 'next-auth/react'

export function AppSidebar({ pathname }) {
	const { data: session } = useSession()
	if (!session) return null
	const { user } = session

	return (
		<Sidebar collapsible="icon" className="group border-none rounded-xl group-data-[collapsible=icon]:mt-2">
			<SidebarHeader>
				<SidebarGroup className="gap-1 group-data-[collapsible=icon]:p-0">
					<Link href="/">
						<img src="/logo.png" alt="Logo" />
					</Link>
					<h1 className="group-data-[collapsible=icon]:hidden text-sidebar-foreground/70 text-xs">Booking System</h1>
					<span className="text-[9px] font-bold group-data-[collapsible=icon]:hidden text-sidebar-foreground/70">v0.0.1 BETA</span>
				</SidebarGroup>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menu</SidebarGroupLabel>
					<SidebarMenu>
						{sidebarLinks.map((item) => {
							const hasChildren = item.children && item.children.length > 0
							const Icon = item.icon
							const isGroupActive = hasChildren && item.children.some(sub => pathname.startsWith(sub.path))
							const isActive = pathname === item.path

							return hasChildren ? (
								<SidebarMenuItem key={item.title}>

									{/* When collapsed */}
									<div className="hidden group-data-[collapsible=icon]:block w-full">
										<SidebarMenuButton asChild tooltip={item.title}>
											<Link href={item.path}>
												{Icon && <Icon className="h-4 w-4" />}
											</Link>
										</SidebarMenuButton>
									</div>

									{/* When expanded */}
									<Collapsible asChild defaultOpen={isGroupActive} className="group-data-[collapsible=icon]:hidden">
										<div>
											<CollapsibleTrigger asChild>
												<SidebarMenuButton tooltip={item.title}>
													{Icon && <Icon className="h-4 w-4" />}
													<span>{item.label}</span>
													<IconSquareChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
												</SidebarMenuButton>
											</CollapsibleTrigger>

											<CollapsibleContent>
												<SidebarMenuSub>
													{item.children.map(subItem => {
														const isSubActive = pathname === subItem.path
														return (
															<SidebarMenuSubItem key={subItem.title}>
																<SidebarMenuSubButton asChild className={isSubActive ? "font-semibold text-sidebar-primary-foreground! hover:text-primary-foreground!" : "hover:text-primary-foreground!"}>
																	<Link href={subItem.path}>
																		<span>{subItem.label}</span>
																	</Link>
																</SidebarMenuSubButton>
															</SidebarMenuSubItem>
														)
													})}
												</SidebarMenuSub>
											</CollapsibleContent>
										</div>
									</Collapsible>

								</SidebarMenuItem>
							) : (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild tooltip={item.title} className={isActive ? "font-semibold text-sidebar-primary-foreground! hover:text-primary-foreground!" : "hover:text-primary-foreground!"}>
										<Link href={item.path}>
											{Icon && <Icon className="h-4 w-4" />}
											<span>{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							)
						})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="group-data-[collapsible=icon]:pl-[6px]">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<div className="flex items-center gap-3 cursor-pointer hover:bg-sidebar-accent group-data-[collapsible=icon]:hover:bg-transparent hover:text-foreground rounded-md px-2 py-1.5 transition group/settings group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mb-2">
							<Avatar className="h-8 w-8 transition-all duration-50 group-data-[collapsible=icon]:hover:border-2 group-data-[collapsible=icon]:hover:border-sidebar-accent">
								<AvatarImage src={`https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(user.id)}`} alt={user.name} />
								<AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="flex flex-col text-left leading-tight group-data-[collapsible=icon]:hidden">
								<span className="text-sm font-medium group-hover/settings:text-primary-foreground">{user.name}</span>
								<span className="text-xs group-hover/settings:text-primary-foreground">{user.role}</span>
							</div>
							<div className="flex flex-col ml-auto group-data-[collapsible=icon]:hidden">
								<IconSettings className="group-hover/settings:block text-sidebar-foreground group-hover/settings:opacity-100 group-hover/settings:text-primary-foreground transition-opacity duration-200" />
							</div>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-30 bg-sidebar-foreground border-sidebar-primary-foreground border shadow-lg data-[collapsible=icon]:ml-2 data-[collapsible=icon]:mb-1 shadow-[0_0_6px_2px_rgba(0,0,0,1)] hover:text-primary-foreground!">
						<DropdownMenuItem asChild>
							<Link href="/profile" className="text-sidebar! hover:text-primary-foreground! group/profile">
								<IconUser className="text-sidebar group-hover/profile:text-primary-foreground!" />My Profile
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/dashboard/settings" className="text-sidebar! hover:text-primary-foreground! group/sett">
								<IconSettings className="text-sidebar group-hover/sett:text-primary-foreground!" />Settings
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator className="border-t border-sidebar-primary-foreground" />
						<DropdownMenuItem asChild>
							<Link href="#" className="text-sidebar! hover:text-primary-foreground! group/logout" onClick={() => signOut({ callbackUrl: "/login" })}>
								<IconLogout className="text-sidebar group-hover/logout:text-primary-foreground!" />Logout
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarFooter>
		</Sidebar>
	)
}
