// app/page.js (the root page)
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
	if (!session) {
		// Not logged in, redirect to login
		redirect("/login")
	}
	
	// Logged in - show dashboard
	return (
		redirect('/dashboard')
	)
}
