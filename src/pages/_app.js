import "@/styles/globals.css"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { Toaster } from "sonner"

export default function MyApp({ Component, pageProps }) {
	const pathname = usePathname()

	// List of paths where sidebar should be hidden
	const noSidebarPaths = ["/login", "/some-other-page"]
	const showSidebar = !noSidebarPaths.includes(pathname)


	return (
		<>
			<SidebarProvider>
				{showSidebar && <AppSidebar />}
				<SidebarInset>
					{showSidebar && <SidebarTrigger className="p-2"></SidebarTrigger>}
					<Component {...pageProps} />
					<Toaster position="bottom-center" closeButton toastOptions={{
						classNames: {
							toast: '!bg-popover',
							icon: '!text-primary',

						},
					}} />
				</SidebarInset>
			</SidebarProvider>
		</>
	);
}