import "@/styles/globals.css"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function MyApp({ Component, pageProps }) {
  return (
    <>
	  <SidebarProvider>
          <AppSidebar />
		  <SidebarInset>
		  	<SidebarTrigger className="p-2 rounded-full bg-background border shadow"><p>Sidebar</p></SidebarTrigger>
			<Component {...pageProps} />
		</SidebarInset>
    	</SidebarProvider>
    </>
  );
}