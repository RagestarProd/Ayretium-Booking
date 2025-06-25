
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { SessionWrapper } from '@/components/SessionWrapper'
import { Toaster } from "sonner"

export default async function RootLayout({ children }) {
	const session = await getServerSession(authOptions)

	if (session) {
		redirect("/dashboard")
	}
	return (
		<SessionWrapper>
			{children}
			<Toaster position="bottom-center" closeButton />
		</SessionWrapper>
	);
}