'use client';

import "@/styles/globals.css"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <head />
      <body>
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>

        <main className="flex-1 container max-w-screen-lg">{children}</main>
      </body>
    </html>
  )
}