'use client'
import { AppSidebar } from "./View"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/lib/navigation";


function findTitleByPath(path, links) {
	for (const link of links) {
		// Exact match
		if (link.path === path) return link.title;

		// If this link has children, recurse into them
		if (link.children) {
			const subTitle = findTitleByPath(path, link.children);
			if (subTitle) return subTitle;
		}
	}
	return null;
}


export function SidebarWrapper({ children, defaultOpen }) {
	const pathname = usePathname(); // e.g., "/booking/new"
	const title = findTitleByPath(pathname, sidebarLinks) || "Untitled";


	return (
		<SidebarProvider
			defaultOpen={defaultOpen}
			style={{
				"--sidebar-width": "200px",
				"--sidebar-width-mobile": "100px",
			}}
		>
			<AppSidebar pathname={pathname} />
			<SidebarInset className="bg-primary-foreground rounded-xl m-4 ml-4 md:ml-0 inset-shadow-sm">
				<div className="flex items-center gap-4 px-4 py-2 border-b">
					<SidebarTrigger className="p-2" />
					<div className="w-px h-6 bg-border" /> {/* vertical separator */}
					<h1 className="text-lg font-semibold text-muted-foreground">{title}</h1>
				</div>
				{children}
			</SidebarInset>
		</SidebarProvider>
	)
}
