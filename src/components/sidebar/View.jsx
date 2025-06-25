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


export function AppSidebar({pathname}) {
	const { data: session } = useSession()
	if (!session) return null // or a loading placeholder
	const { user } = session

	return (
		<Sidebar collapsible="icon" className="group border-none rounded-xl group-data-[collapsible=icon]:mt-2">
			<SidebarHeader>
				<SidebarGroup className="gap-1 group-data-[collapsible=icon]:p-0 ">
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
							const isActive = item.path === pathname
							const Icon = item.icon;

							// Check if any subitem matches the current path
							const isGroupActive =
								hasChildren &&
								item.children.some((sub) => pathname.startsWith(sub.path))

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
												{Icon && <Icon className="h-4 w-4" />}
												<span>{item.title}</span>
												<IconSquareChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.children.map((subItem) => {
													const isActive = pathname === subItem.path
													return (
														<SidebarMenuSubItem key={subItem.title}>
															<SidebarMenuSubButton
																asChild
																className={isActive ? "font-semibold" : ""}
															>
																<Link href={subItem.path}>
																	<span>{subItem.title}</span>
																</Link>
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
									<SidebarMenuButton asChild tooltip={item.title} className={isActive ? "font-semibold" : ""}>
										<Link href={item.path}>
												{Icon && <Icon className="h-4 w-4" />}
												<span>{item.title}</span>
										</Link>
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
						<div className="flex items-center gap-3 cursor-pointer hover:bg-sidebar-accent hover:text-foreground rounded-md px-2 py-1.5 transition group/settings group-data-[collapsible=icon]:p-0">
							<Avatar className="h-8 w-8">
								<AvatarImage src="/avatars/admin.jpg" alt={user.name} />
								<AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="flex flex-col text-left leading-tight group-data-[collapsible=icon]:hidden">
								<span className="text-sm font-medium">{user.name}</span>
								<span className="text-xs">{user.role}</span>
							</div>
							<div className="flex flex-col ml-auto group-data-[collapsible=icon]:hidden">
								<IconSettings className="group-hover/settings:block opacity-0 group-hover/settings:opacity-100 transition-opacity duration-200" />
							</div>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuItem asChild>
							<Link href="/profile">
								<IconUser />My Profile
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/settings">
								<IconSettings />Settings
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Button variant="link" onClick={() => signOut({ callbackUrl: "/login" })}><IconLogout />Logout</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarFooter>
		</Sidebar>
	)
}
