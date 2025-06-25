
import { cookies } from "next/headers"
import { Toaster } from "sonner"
import { SidebarWrapper } from '@/components/sidebar/Wrapper'

export default async function Layout({ children }) {
	const cookieStore = await cookies()
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
	
	return (
			<SidebarWrapper
				defaultOpen={defaultOpen}
			>
				{children}
				<Toaster position="bottom-center" closeButton />
			</SidebarWrapper>
	);
}